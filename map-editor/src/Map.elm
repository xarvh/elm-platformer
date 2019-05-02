module Map exposing (define, prog)

import Browser
import Browser.Dom
import Browser.Events
import Dict exposing (Dict)
import Dict.Extra
import Html exposing (Html, div)
import Html.Attributes exposing (class, classList)
import Html.Events
import Html.Events.Extra.Wheel
import Json.Decode exposing (Decoder)
import Keyboard
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Nbsp exposing (nbsp)
import Pois exposing (Pois)
import Svg exposing (Svg)
import Svg.Attributes as SA
import Svgl.Primitives exposing (Attributes, defaultUniforms, rect)
import Svgl.Tree
import Task
import Tiles exposing (SquareCollider, TileType)
import TransformTree exposing (..)
import Vector exposing (Vector)
import Viewport exposing (Viewport)
import Viewport.Combine
import WebGL exposing (Shader)
import WebGL.Settings exposing (Setting)
import WebGL.Settings.Blend as Blend
import WebGL.Texture exposing (Texture)


-- types


type alias Pair =
    ( Int, Int )


type alias TileId =
    { l : Int, b : Int }


type Mode
    = ModeTiles
    | ModePois


type alias Map pois =
    { tiles : List String
    , pois : pois
    }


type alias UndoSnapshot =
    { tiles : Dict Pair TileId
    , pois : Dict String Vector
    }


type alias Model =
    { viewport : Viewport
    , maybeTileSprites : Maybe Texture
    , mousePixelPosition : Viewport.PixelPosition
    , mouseWorldPosition : Vector
    , mouseButtonIsDown : Bool
    , newKeys : List Keyboard.Key
    , oldKeys : List Keyboard.Key

    -- Editor meta
    , cameraPosition : Vector
    , selectedTileBrushId : TileId
    , mode : Mode
    , undoHistory : List UndoSnapshot
    , redoHistory : List UndoSnapshot
    , hoveredPoi : String
    , selectedPoi : String
    , renamingPoi : Maybe ( String, String )
    , showSave : Bool

    -- Map State
    , tiles : Dict Pair TileId
    , pois : Pois
    }


type Msg
    = Noop
    | OnResize Viewport.PixelSize
    | OnKey Keyboard.Msg
    | OnMouseMove Viewport.PixelPosition
    | OnMouseButton Bool
    | OnMouseWheel Float
    | OnMouseEnterPoi String
    | OnMouseLeavePoi String
    | OnMouseClickPoi String
    | OnRenamePoiInput String
    | OnClickTileBrush TileId
    | OnTextureLoad (Result WebGL.Texture.Error Texture)


type alias MapBoundaries =
    { minX : Int
    , maxX : Int
    , minY : Int
    , maxY : Int
    }



--


sortedTiles =
    Tiles.tilesById
        |> Dict.values
        |> List.sortBy .id


noCmd : Model -> ( Model, Cmd Msg )
noCmd model =
    ( model, Cmd.none )


ifThenElse : Bool -> a -> a -> a
ifThenElse condition then_ else_ =
    if condition then
        then_
    else
        else_



--


init : Map pois -> {} -> ( Model, Cmd Msg )
init map flags =
    let
        tiles =
            --TODO
            Dict.empty

        pois =
            case Pois.parse (Debug.toString map.pois) of
                Ok p ->
                    p

                Err err ->
                    Debug.todo (Debug.toString err)

        { minX, maxX, minY, maxY } =
            mapBoundaries tiles

        model =
            { viewport =
                makeViewport
                    { width = 640
                    , height = 480
                    }
            , mousePixelPosition = { top = 0, left = 0 }
            , mouseWorldPosition = Vector.origin
            , mouseButtonIsDown = False
            , newKeys = []
            , oldKeys = []
            , maybeTileSprites = Nothing

            -- Editor meta
            , cameraPosition =
                { x = 0.5 * toFloat (maxX + minX)
                , y = 0.5 * toFloat (maxY + minY)
                }
            , selectedTileBrushId = { l = 0, b = 0 }
            , mode = ModeTiles
            , showSave = False
            , undoHistory = []
            , redoHistory = []
            , hoveredPoi = ""
            , selectedPoi = ""
            , renamingPoi = Nothing

            -- Map State
            , pois = pois
            , tiles = tiles
            }

        loadTextureTask =
            WebGL.Texture.loadWith
                { magnify = WebGL.Texture.nearest
                , minify = WebGL.Texture.nearest
                , horizontalWrap = WebGL.Texture.mirroredRepeat
                , verticalWrap = WebGL.Texture.mirroredRepeat
                , flipY = True
                }
                "static/bulkhead.png"

        cmd =
            Cmd.batch
                [ Viewport.getWindowSize OnResize
                , Task.attempt OnTextureLoad loadTextureTask
                ]
    in
    ( model, cmd )



--
{-
   fromHumanMap : Map a -> Dict Pair TileId
   fromHumanMap map =
       let
           height =
               List.length map.tiles

           width =
               map.tiles
                   |> List.map String.length
                   |> List.maximum
                   |> Maybe.withDefault 20
       in
       map.tiles
           |> List.reverse
           |> List.indexedMap (\y -> String.toList >> List.indexedMap (\x c -> ( ( x, y ), c )))
           |> List.concat
           |> Dict.fromList


   toHumanMap : Pois -> Dict Pair TileId -> ( List String, Pois )
   toHumanMap pois tiles =
       let
           bounds =
               mapBoundaries tiles

           rx =
               List.range bounds.minX bounds.maxX

           ry =
               List.range bounds.minY bounds.maxY

           get x y =
               tiles
                   |> Dict.get ( x, y )
                   |> Maybe.withDefault ' '

           makeRow y =
               rx
                   |> List.map (\x -> get x y)
                   |> String.fromList

           offset =
               Vector (toFloat -bounds.minX) (toFloat -bounds.minY)
       in
       ( ry
           |> List.map makeRow
           |> List.reverse
       , pois
           |> Dict.map (\id value -> Vector.sub value offset)
       )



   asFile : Model -> String
   asFile model =
       let
           ( mapRows, fixedPois ) =
               toHumanMap model.pois model.tiles
                   |> Tuple.mapFirst (List.map Debug.toString)

           poisKeyValues =
               model.pois
                   |> Dict.toList
                   |> List.sortBy Tuple.first
                   |> List.map (\( k, v ) -> k ++ " = " ++ Debug.toString v)
       in
       """
   import Map


   main =
       Map.define
           { tiles =
               [ """ ++ String.join "\n            , " mapRows ++ """
               ]
           , pois =
               { """ ++ String.join "\n            , " poisKeyValues ++ """
               }
           }
   """
-}
-- update


makeViewport : Viewport.PixelSize -> Viewport
makeViewport pixelSize =
    { pixelSize = pixelSize
    , minimumVisibleWorldSize = { width = 20, height = 20 }
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            noCmd model

        OnResize size ->
            { model | viewport = makeViewport size }
                |> noCmd

        OnKey keymsg ->
            let
                ( keys, maybeKeyChange ) =
                    Keyboard.updateWithKeyChange Keyboard.anyKey keymsg model.newKeys
            in
            { model
                | newKeys = keys
                , oldKeys = model.newKeys
            }
                |> updateOnKeyChange maybeKeyChange

        OnMouseMove pixelPosition ->
            let
                worldPosition =
                    Viewport.pixelToWorld
                        model.viewport
                        pixelPosition
                        |> Vector.add model.cameraPosition
            in
            { model
                | mousePixelPosition = pixelPosition
                , mouseWorldPosition = worldPosition
            }
                -- NOTE no pushing!
                |> ifThenElse (model.mouseButtonIsDown && model.mode == ModeTiles) replaceTile identity
                |> noCmd

        OnMouseWheel deltaY ->
            -- TODO zoom
            noCmd model

        OnMouseButton isDown ->
            { model | mouseButtonIsDown = isDown }
                |> (case model.mode of
                        ModeTiles ->
                            ifThenElse isDown (pushUndoSnapshotFrom model >> replaceTile) identity

                        ModePois ->
                            if isDown && model.selectedPoi /= "" then
                                pushUndoSnapshotFrom model >> poiToMouse model.selectedPoi
                            else
                                identity
                   )
                |> noCmd

        OnMouseEnterPoi name ->
            noCmd { model | hoveredPoi = name }

        OnMouseLeavePoi name ->
            noCmd <|
                if model.hoveredPoi == name then
                    { model | hoveredPoi = "" }
                else
                    model

        OnMouseClickPoi name ->
            if model.mode /= ModePois then
                noCmd model
            else if model.selectedPoi == name then
                ( { model | renamingPoi = Just ( name, name ) }
                , Task.attempt (always Noop) (Browser.Dom.focus name)
                )
            else
                noCmd { model | selectedPoi = name }

        OnRenamePoiInput s ->
            noCmd <|
                { model | renamingPoi = Maybe.map (always s |> Tuple.mapSecond) model.renamingPoi }

        OnClickTileBrush id ->
            noCmd <|
                { model | selectedTileBrushId = id }

        OnTextureLoad result ->
            case result of
                Err err ->
                    Debug.todo (Debug.toString err)

                Ok texture ->
                    noCmd { model | maybeTileSprites = Just texture }


updateOnKeyChange : Maybe Keyboard.KeyChange -> Model -> ( Model, Cmd Msg )
updateOnKeyChange maybeKeyChange model =
    noCmd <|
        case maybeKeyChange of
            Just (Keyboard.KeyDown key) ->
                if model.mode == ModePois && model.renamingPoi /= Nothing then
                    case key of
                        Keyboard.Enter ->
                            model |> setRenamedPoi

                        Keyboard.Escape ->
                            { model | renamingPoi = Nothing }

                        _ ->
                            model
                else
                    case ( model.mode, Debug.log "KEY" key ) of
                        -- Mode switch
                        ( ModeTiles, Keyboard.Backspace ) ->
                            { model | mode = ModePois }

                        ( ModePois, Keyboard.Backspace ) ->
                            { model | mode = ModeTiles }

                        -- Save
                        --                         ( _, Keyboard.Character "s" ) ->
                        --                             { model | showSave = not model.showSave }
                        ( _, Keyboard.Escape ) ->
                            { model | showSave = False }

                        -- Panning
                        ( _, Keyboard.ArrowLeft ) ->
                            model |> updatePan -1 0

                        ( _, Keyboard.ArrowRight ) ->
                            model |> updatePan 1 0

                        ( _, Keyboard.ArrowUp ) ->
                            model |> updatePan 0 1

                        ( _, Keyboard.ArrowDown ) ->
                            model |> updatePan 0 -1

                        ( _, Keyboard.Character " " ) ->
                            { model | cameraPosition = model.mouseWorldPosition }

                        -- Undo
                        ( _, Keyboard.Character "u" ) ->
                            model |> undo

                        ( _, Keyboard.Character "U" ) ->
                            model |> redo

                        -- Mode : Tiles
                        ( ModeTiles, Keyboard.Character "r" ) ->
                            model |> duplicateRow (round model.mouseWorldPosition.y)

                        ( ModeTiles, Keyboard.Character "R" ) ->
                            model |> removeRow (round model.mouseWorldPosition.y)

                        ( ModeTiles, Keyboard.Character "c" ) ->
                            model |> duplicateColumn (round model.mouseWorldPosition.x)

                        ( ModeTiles, Keyboard.Character "C" ) ->
                            model |> removeColumn (round model.mouseWorldPosition.x)

                        ( ModeTiles, Keyboard.Character "w" ) ->
                            model |> moveTileBrushSelection 0 1

                        ( ModeTiles, Keyboard.Character "a" ) ->
                            model |> moveTileBrushSelection -1 0

                        ( ModeTiles, Keyboard.Character "s" ) ->
                            model |> moveTileBrushSelection 0 -1

                        ( ModeTiles, Keyboard.Character "d" ) ->
                            model |> moveTileBrushSelection 1 0

                        -- Mode: Pois
                        ( ModePois, Keyboard.Character "a" ) ->
                            model |> addPoi

                        ( ModePois, Keyboard.Character "d" ) ->
                            model |> deletePoi

                        _ ->
                            model

            _ ->
                model


updatePan : Int -> Int -> Model -> Model
updatePan dx dy model =
    let
        -- TODO
        gotoBoundary =
            List.member Keyboard.Shift model.newKeys

        cameraPosition =
            Vector (toFloat dx) (toFloat dy)
                |> Vector.scale 4
                |> Vector.add model.cameraPosition
    in
    { model | cameraPosition = cameraPosition }


setRenamedPoi : Model -> Model
setRenamedPoi model =
    case model.renamingPoi of
        Nothing ->
            model

        Just ( oldName, newName ) ->
            -- Prevent duplicate names
            if Dict.member newName model.pois then
                model
            else if oldName == newName then
                { model | renamingPoi = Nothing }
            else
                let
                    updateName key =
                        if key == oldName then
                            newName
                        else
                            key
                in
                { model
                    | pois = Dict.Extra.mapKeys updateName model.pois
                    , renamingPoi = Nothing
                    , selectedPoi = newName
                }
                    |> pushUndoSnapshotFrom model


poiToMouse : String -> Model -> Model
poiToMouse name model =
    { model | pois = Dict.insert name model.mouseWorldPosition model.pois }


addPoi : Model -> Model
addPoi model =
    let
        toName n =
            "new" ++ String.fromInt n

        findNonDuplicateName n =
            case Dict.get (toName n) model.pois of
                Just _ ->
                    findNonDuplicateName (n + 1)

                Nothing ->
                    toName n

        name =
            findNonDuplicateName 0
    in
    { model
        | pois = Dict.insert name model.cameraPosition model.pois
        , selectedPoi = name
    }
        |> pushUndoSnapshotFrom model


deletePoi : Model -> Model
deletePoi model =
    { model | pois = Dict.remove model.selectedPoi model.pois }
        |> pushUndoSnapshotFrom model



-- Undo ----------------------------------------------------------------------


getUndoSnapshot : Model -> UndoSnapshot
getUndoSnapshot { pois, tiles } =
    { pois = pois
    , tiles = tiles
    }


setUndoSnapshot : UndoSnapshot -> Model -> Model
setUndoSnapshot { pois, tiles } model =
    { model
        | pois = pois
        , tiles = tiles
    }


pushUndoSnapshotFrom : Model -> Model -> Model
pushUndoSnapshotFrom oldModel newModel =
    { newModel
        | undoHistory = getUndoSnapshot oldModel :: newModel.undoHistory
        , redoHistory = []
    }


undo : Model -> Model
undo model =
    case model.undoHistory of
        [] ->
            model

        h :: hs ->
            { model
                | undoHistory = hs
                , redoHistory = getUndoSnapshot model :: model.redoHistory
            }
                |> setUndoSnapshot h


redo : Model -> Model
redo model =
    case model.redoHistory of
        [] ->
            model

        r :: rs ->
            { model
                | undoHistory = getUndoSnapshot model :: model.undoHistory
                , redoHistory = rs
            }
                |> setUndoSnapshot r



-- Brush ---------------------------------------------------------------------


moveTileBrushSelection : Int -> Int -> Model -> Model
moveTileBrushSelection dl db model =
    let
        -- TODO replace hardcoded 8
        l =
            modBy 8 (model.selectedTileBrushId.l + dl + 8)

        b =
            modBy 8 (model.selectedTileBrushId.b + db + 8)
    in
    { model | selectedTileBrushId = { l = l, b = b } }


replaceTile : Model -> Model
replaceTile model =
    let
        position =
            model.mouseWorldPosition

        row =
            round position.y

        column =
            round position.x

        tiles =
            Dict.insert ( round position.x, round position.y ) model.selectedTileBrushId model.tiles
    in
    { model | tiles = tiles }



-- Rows / Columns duplicate / remove -----------------------------------------


mapBoundaries : Dict Pair a -> MapBoundaries
mapBoundaries tiles =
    let
        ( xs, ys ) =
            tiles
                |> Dict.keys
                |> List.unzip

        mmin =
            List.minimum >> Maybe.withDefault 0

        mmax =
            List.maximum >> Maybe.withDefault 1
    in
    { minX = mmin xs
    , maxX = mmax xs
    , minY = mmin ys
    , maxY = mmax ys
    }


boundaries_fold : (Pair -> a -> a) -> a -> MapBoundaries -> a
boundaries_fold fun zero { minX, maxX, minY, maxY } =
    List.range minX maxX
        |> List.foldl (\x accum -> List.range minY maxY |> List.foldl (\y a -> fun ( x, y ) a) accum) zero


transfer : (MapBoundaries -> MapBoundaries) -> (Pair -> Pair) -> Model -> Model
transfer updateBounds destinationToSourcePair model =
    let
        tiles =
            model.tiles
                |> mapBoundaries
                |> updateBounds
                |> boundaries_fold copyTiles Dict.empty

        copyTiles destinationPair ts =
            Dict.empty

        -- TODO Dict.insert destinationPair (getTileId model (destinationToSourcePair destinationPair)) ts
    in
    -- TODO: also modify pois
    { model | tiles = tiles }
        |> pushUndoSnapshotFrom model


duplicateColumn : Int -> Model -> Model
duplicateColumn column model =
    let
        updateBounds bounds =
            { bounds | maxX = bounds.maxX + 1 }

        destinationToSourcePair ( destX, destY ) =
            ( if destX <= column then
                destX
              else
                destX - 1
            , destY
            )
    in
    transfer updateBounds destinationToSourcePair model


removeColumn : Int -> Model -> Model
removeColumn column model =
    let
        updateBounds bounds =
            { bounds | maxX = bounds.maxX - 1 }

        destinationToSourcePair ( destX, destY ) =
            ( if destX < column then
                destX
              else
                destX + 1
            , destY
            )
    in
    transfer updateBounds destinationToSourcePair model


duplicateRow : Int -> Model -> Model
duplicateRow row model =
    let
        updateBounds bounds =
            { bounds | maxY = bounds.maxY + 1 }

        destinationToSourcePair ( destX, destY ) =
            ( destX
            , if destY <= row then
                destY
              else
                destY - 1
            )
    in
    transfer updateBounds destinationToSourcePair model


removeRow : Int -> Model -> Model
removeRow row model =
    let
        updateBounds bounds =
            { bounds | maxY = bounds.maxY - 1 }

        destinationToSourcePair ( destX, destY ) =
            ( destX
            , if destY < row then
                destY
              else
                destY + 1
            )
    in
    transfer updateBounds destinationToSourcePair model



-- Tiles Palette -------------------------------------------------------------


settings : List Setting
settings =
    -- https://limnu.com/webgl-blending-youre-probably-wrong/
    [ Blend.add Blend.one Blend.oneMinusSrcAlpha ]


type alias Uniforms =
    { entityToWorld : Mat4
    , worldToCamera : Mat4
    , entityToTexture : Mat4
    , tileSprites : Texture
    }


type alias Varying =
    { localPosition : Vec2
    , worldPosition : Vec2
    }


quadVertexShader : Shader Attributes Uniforms Varying
quadVertexShader =
    [glsl|
        precision mediump float;
        precision mediump int;

        attribute vec2 position;

        uniform mat4 entityToWorld;
        uniform mat4 worldToCamera;

        varying vec2 localPosition;
        varying vec2 worldPosition;

        void main () {
            localPosition = position;
            vec4 worldPosition4 = entityToWorld * vec4(localPosition, 0, 1);

            worldPosition = worldPosition4.xy;
            gl_Position = worldToCamera * worldPosition4;
        }
    |]


fragmentShader : Shader {} Uniforms Varying
fragmentShader =
    [glsl|
        precision mediump float;
        precision mediump int;

        uniform sampler2D tileSprites;
        uniform mat4 entityToTexture;

        varying vec2 localPosition;
        varying vec2 worldPosition;

        void main () {

          float x = localPosition.x;
          float y = localPosition.y;


          vec4 textureCoordinates = entityToTexture * vec4(x, y, 0, 1);


          vec4 src = texture2D(tileSprites, textureCoordinates.xy);

          gl_FragColor = src.a * src;
        }
    |]


spritesPalette : Texture -> Model -> ( List WebGL.Entity, List (Svg Msg) )
spritesPalette tileSprites model =
    let
        widthInTiles =
            8

        heightInTiles =
            8

        scale =
            1 / max widthInTiles heightInTiles

        visibleWorldSize =
            Viewport.actualVisibleWorldSize model.viewport

        paletteWidth =
            toFloat widthInTiles

        paletteHeight =
            toFloat heightInTiles

        paletteLeft =
            -(visibleWorldSize.width / 2) + 1

        paletteBottom =
            (visibleWorldSize.height / 2) - paletteHeight - 1

        worldToCamera =
            model.viewport
                |> Viewport.worldToCameraTransform

        selection =
            Svg.rect
                [ worldToCamera
                    |> Mat4.translate3
                        (paletteLeft + toFloat model.selectedTileBrushId.l)
                        (paletteBottom + toFloat model.selectedTileBrushId.b)
                        0
                    |> Viewport.Combine.transform
                , SA.fill "none"
                , SA.stroke "red"
                , SA.strokeWidth "0.1"
                , SA.x "0"
                , SA.y "0"
                , SA.width "1"
                , SA.height "1"
                ]
                []

        drawTile : Int -> Int -> WebGL.Entity
        drawTile tileX tileY =
            let
                x =
                    paletteLeft + toFloat tileX

                y =
                    paletteBottom + toFloat tileY

                tOffX =
                    toFloat tileX

                tOffY =
                    toFloat tileY

                entityToTexture =
                    Mat4.identity
                        |> Mat4.scale3 scale scale 1
                        |> Mat4.translate3 (tOffX + 0.5) (tOffY + 0.5) 0

                entityToWorld =
                    Mat4.identity
                        |> Mat4.translate3 (x + 0.5) (y + 0.5) 0
            in
            WebGL.entityWith
                settings
                quadVertexShader
                fragmentShader
                Svgl.Primitives.normalizedQuadMesh
                { entityToWorld = entityToWorld
                , worldToCamera = worldToCamera
                , entityToTexture = entityToTexture
                , tileSprites = tileSprites
                }
    in
    ( (widthInTiles - 1)
        |> List.range 0
        |> List.concatMap (\x -> List.range 0 (heightInTiles - 1) |> List.map (\y -> drawTile x y))
    , [ selection ]
    )



-- Scene ---------------------------------------------------------------------


entities : Model -> ( List WebGL.Entity, List (Svg Msg) )
entities model =
    let
        worldToCamera =
            model.viewport
                |> Viewport.worldToCameraTransform
                |> Mat4.translate3 -model.cameraPosition.x -model.cameraPosition.y 0

        -- Tiles
        tilesEntities =
            case model.maybeTileSprites of
                Nothing ->
                    []

                Just tileSprites ->
                    model.tiles
                        |> Dict.toList
                        |> List.map (renderTile worldToCamera tileSprites)

        ( paletteEntities, paletteSvg ) =
            case ( model.maybeTileSprites, model.mode ) of
                ( Just tileSprites, ModeTiles ) ->
                    spritesPalette tileSprites model

                _ ->
                    ( [], [] )

        svgs =
            model.pois
                |> Dict.toList
                |> List.map (renderPoi model worldToCamera)
    in
    ( tilesEntities ++ paletteEntities
    , svgs ++ paletteSvg
    )


renderTile : Mat4 -> Texture -> ( Pair, TileId ) -> WebGL.Entity
renderTile worldToCamera tileSprites ( ( tileX, tileY ), tileId ) =
    let
        entityToTexture =
            Mat4.identity
                |> Mat4.scale3 (1 / 8) (1 / 8) 1
                |> Mat4.translate3 (toFloat tileId.l + 0.5) (toFloat tileId.b + 0.5) 0

        entityToWorld =
            Mat4.identity
                |> Mat4.translate3 (toFloat tileX) (toFloat tileY) 0
    in
    WebGL.entityWith
        settings
        quadVertexShader
        fragmentShader
        Svgl.Primitives.normalizedQuadMesh
        { entityToWorld = entityToWorld
        , worldToCamera = worldToCamera
        , entityToTexture = entityToTexture
        , tileSprites = tileSprites
        }


renderPoi : Model -> Mat4 -> ( String, Vector ) -> Svg Msg
renderPoi model worldToCamera ( name, point ) =
    let
        ( fill, stroke ) =
            if model.mode /= ModePois then
                ( "lightGray", "darkGrey" )
            else if model.selectedPoi == name then
                ( "cyan", "blue" )
            else if model.hoveredPoi == name then
                ( "yellow", "orange" )
            else
                ( "lightGray", "darkGrey" )
    in
    Svg.g
        [ worldToCamera
            |> Mat4.translate3 point.x point.y 0
            |> Viewport.Combine.transform
        ]
        [ Svg.circle
            [ SA.r "0.3"
            , SA.fill fill
            , SA.stroke stroke
            , SA.strokeWidth "0.04"
            , SA.style "cursor: pointer;"
            , SA.opacity
                (if model.mode == ModePois then
                    "1"
                 else
                    "0.5"
                )

            --
            , Html.Events.onMouseEnter (OnMouseEnterPoi name)
            , Html.Events.onMouseLeave (OnMouseLeavePoi name)
            , Html.Events.stopPropagationOn "mousedown"
                (if model.selectedPoi == name then
                    -- if the POI is selected, allow the event to propagate to
                    -- the background, so that new positions can be picked even
                    -- if they are inside the circle
                    Json.Decode.fail ""
                 else
                    Json.Decode.succeed ( OnMouseClickPoi name, True )
                )
            ]
            []
        , if model.mode /= ModePois then
            Svg.text ""
          else
            Svg.text_ [] []

        -- Svg.text name ]
        ]



-- View


view : Model -> Browser.Document Msg
view model =
    let
        ( webGlEntities, svgContent ) =
            entities model
    in
    { title = "Generic platformer"
    , body =
        [ Viewport.Combine.wrapper
            { viewportSize = model.viewport.pixelSize
            , elementAttributes =
                [ Html.Events.Extra.Wheel.onWheel (.deltaY >> OnMouseWheel)
                , Html.Events.onMouseDown (OnMouseButton True)
                ]
            , webglOptions =
                [ WebGL.alpha True
                , WebGL.antialias
                , WebGL.clearColor 0.2 0.2 0.2 1
                ]
            , webGlEntities = webGlEntities
            , svgContent = svgContent
            }
        , case model.mode of
            ModeTiles ->
                Html.text ""

            ModePois ->
                viewPoisPalette model
        , if model.showSave then
            viewSave model
          else
            Html.text ""
        , Html.node "style" [] [ Html.text stylesheet ]
        ]
    }


viewPoisPalette : Model -> Html Msg
viewPoisPalette model =
    model.pois
        |> Dict.toList
        |> List.sortBy Tuple.first
        |> List.map (viewPois model)
        |> div [ class "palette pois-palette" ]


viewPois : Model -> ( String, Vector ) -> Html Msg
viewPois model ( name, position ) =
    let
        maybeNewName =
            case model.renamingPoi of
                Nothing ->
                    Nothing

                Just ( oldName, newName ) ->
                    if oldName == name then
                        Just newName
                    else
                        Nothing
    in
    case maybeNewName of
        Just newName ->
            Html.input
                [ Html.Attributes.value newName
                , Html.Attributes.id name
                , Html.Events.onInput OnRenamePoiInput
                ]
                []

        Nothing ->
            div
                [ Html.Events.onMouseEnter (OnMouseEnterPoi name)
                , Html.Events.onMouseLeave (OnMouseLeavePoi name)
                , Html.Events.onClick (OnMouseClickPoi name)
                , classList
                    [ ( "poi-selected", model.selectedPoi == name )
                    , ( "poi-hovered", model.hoveredPoi == name )
                    , ( "poi", True )
                    ]
                ]
                [ Html.text name ]


viewSave : Model -> Html Msg
viewSave model =
    div
        [ class "save"
        ]
        [ Html.pre []
            [ Html.code []
                [--TODO Html.text (asFile model)
                ]
            ]
        ]



-- subscriptions


mousePositionDecoder : Decoder Viewport.PixelPosition
mousePositionDecoder =
    Json.Decode.map2 (\x y -> { left = x, top = y })
        (Json.Decode.field "clientX" Json.Decode.int)
        (Json.Decode.field "clientY" Json.Decode.int)


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Viewport.onWindowResize OnResize
        , Keyboard.subscriptions |> Sub.map OnKey
        , Browser.Events.onMouseMove mousePositionDecoder |> Sub.map OnMouseMove
        , Browser.Events.onMouseUp (Json.Decode.succeed (OnMouseButton False))
        ]



-- Main


define =
    identity


prog map =
    Browser.document
        { view = view
        , subscriptions = subscriptions
        , update = update
        , init = init map
        }



-- Style


stylesheet =
    """
body {
  margin: 0;
  padding: 0;

  width: 100vw;
  height: 100vh;
  overflow: hidden;

  font-family: 'SaarlandMedium', sans-serif;
}

.palette {
    position: absolute;
    top: 1em;
    left: 1em;

    background-color: white;
    border: 1px solid black;
    padding: 0.3em 1em;

    display: flex;
    flex-direction: column;
    justify-content: center;

    user-select: none;
}

.brush-palette {
    width: 3em;
    align-items: center;
}

.brush-palette > * {
    cursor: pointer;
}


.pois-palette {
    align-items: flex-start;
}

.pois-palette > div + div {
    margin-top: 0.5em;
}

.poi {
  cursor: pointer;
}

.poi-selected {
    font-weight: bold;
}

.poi-hovered {
    font-style: italic;
}

.save {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
}

.save > * {
    background-color: white;
    border: 1px solid black;
    padding: 1em;
}
"""
