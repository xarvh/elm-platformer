module Main exposing (..)

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
import Json.Encode
import Keyboard
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import Nbsp exposing (nbsp)
import Pois exposing (Pois)
import Ports
import Random
import Random.Extra
import Set exposing (Set)
import Svg exposing (Svg)
import Svg.Attributes as SA
import Svgl.Primitives exposing (Attributes, defaultUniforms, rect)
import Svgl.Tree
import Task
import Tileset exposing (TileType, Tileset)
import Tileset.Bulkhead
import TransformTree exposing (..)
import Vector exposing (Vector)
import Viewport exposing (Viewport)
import Viewport.Combine
import WebGL exposing (Shader)
import WebGL.Settings exposing (Setting)
import WebGL.Settings.Blend as Blend
import WebGL.Texture exposing (Texture)


-- types


type Mode
    = ModeTiles
    | ModePois


type alias Flags =
    { localStorageMap : String
    , dateNow : Int
    }


type alias Model =
    { viewportPixelSize : Viewport.PixelSize
    , flags : Flags
    , minimumVisibleWorldSize : Float
    , maybeTileset : Maybe Tileset
    , mousePixelPosition : Viewport.PixelPosition
    , mouseWorldPosition : Vector
    , mouseButtonIsDown : Bool
    , newKeys : List Keyboard.Key
    , oldKeys : List Keyboard.Key
    , seed : Random.Seed

    -- Editor meta
    , mode : Mode
    , patternMode : Bool
    , alternativeMode : Bool
    , cameraPosition : Vector
    , selectedTileType : TileType
    , previousSelectedTileType : TileType
    , undoHistory : List MapState
    , redoHistory : List MapState
    , hoveredPoi : String
    , selectedPoi : String
    , renamingPoi : Maybe ( String, String )
    , showSave : Bool

    -- Map State
    , tiles : Dict MapTileCoordinate TileType
    , pois : Dict String Vector
    }


type alias MapTileCoordinate =
    ( Int, Int, Int )


type alias MapState =
    { tiles : Dict MapTileCoordinate TileType
    , pois : Dict String Vector
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
    | OnClickTileBrush TileType
    | OnTilesetLoad (Result String Tileset)


type alias MapBoundaries =
    { minX : Int
    , maxX : Int
    , minY : Int
    , maxY : Int
    }



-- Decoders / Encoders


mapDecoder : Tileset -> Decoder MapState
mapDecoder tileset =
    Json.Decode.map2 MapState
        (Json.Decode.field "tiles" (tilesDecoder tileset))
        (Json.Decode.field "pois" (Json.Decode.dict vectorDecoder))


tilesDecoder : Tileset -> Decoder (Dict MapTileCoordinate TileType)
tilesDecoder tileset =
    tileset
        |> tileTupleDecoder
        |> Json.Decode.list
        |> Json.Decode.map Dict.fromList


tileTupleDecoder : Tileset -> Decoder ( MapTileCoordinate, TileType )
tileTupleDecoder tileset =
    Json.Decode.int
        |> Json.Decode.list
        |> Json.Decode.andThen (listToTuple >> maybeToDecoder "expecting exactly 4 integers")
        |> Json.Decode.andThen (tupleIdToTileType tileset)


tupleIdToTileType : Tileset -> ( MapTileCoordinate, Int ) -> Decoder ( MapTileCoordinate, TileType )
tupleIdToTileType tileset ( coords, id ) =
    tileset.tileTypes
        |> List.Extra.find (\t -> t.id == id)
        |> maybeToDecoder "given id is not in tileset"
        |> Json.Decode.map (Tuple.pair coords)


listToTuple : List Int -> Maybe ( MapTileCoordinate, Int )
listToTuple list =
    case list of
        x :: y :: layer :: id :: [] ->
            Just ( ( x, y, layer ), id )

        _ ->
            Nothing


maybeToDecoder : String -> Maybe a -> Decoder a
maybeToDecoder error maybe =
    case maybe of
        Nothing ->
            Json.Decode.fail error

        Just a ->
            Json.Decode.succeed a


vectorDecoder : Decoder Vector
vectorDecoder =
    Json.Decode.map2 Vector
        (Json.Decode.field "x" Json.Decode.float)
        (Json.Decode.field "y" Json.Decode.float)


encodeMap : MapState -> Json.Encode.Value
encodeMap { tiles, pois } =
    Json.Encode.object
        [ ( "tiles"
          , tiles
                |> Dict.toList
                |> Json.Encode.list encodeTileTuple
          )
        , ( "pois"
          , pois
                |> Json.Encode.dict identity encodeVector
          )
        ]


encodeTileTuple : ( MapTileCoordinate, TileType ) -> Json.Encode.Value
encodeTileTuple ( ( x, y, layer ), tt ) =
    Json.Encode.list Json.Encode.int [ x, y, layer, tt.id ]


encodeVector : Vector -> Json.Encode.Value
encodeVector v =
    Json.Encode.object
        [ ( "x", Json.Encode.float v.x )
        , ( "y", Json.Encode.float v.y )
        ]



--


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


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        placeholderTileType =
            { id = -1
            , render = Tileset.RenderEmpty
            , maybeBlocker = Just Tileset.BlockerFourSides
            , layer = 0
            , alternativeGroupId = 0
            , maybePatternFragment = Nothing
            }

        model =
            { viewportPixelSize = { width = 640, height = 480 }
            , flags = flags
            , minimumVisibleWorldSize = 20
            , mousePixelPosition = { top = 0, left = 0 }
            , mouseWorldPosition = Vector.origin
            , mouseButtonIsDown = False
            , newKeys = []
            , oldKeys = []
            , maybeTileset = Nothing
            , patternMode = True
            , alternativeMode = True
            , seed = Random.initialSeed flags.dateNow

            -- Editor meta
            , cameraPosition = { x = 0, y = 0 }
            , selectedTileType = placeholderTileType
            , previousSelectedTileType = placeholderTileType
            , mode = ModeTiles
            , showSave = False
            , undoHistory = []
            , redoHistory = []
            , hoveredPoi = ""
            , selectedPoi = ""
            , renamingPoi = Nothing

            -- Map State
            , pois = Dict.empty
            , tiles = Dict.empty
            }

        -- TODO tese are here because otherwise Elm will not populate app.ports
        elmgetyourshittogether =
            [ Ports.saveAs { name = "lol.json", mime = "text/json", content = "{}" }
            , Ports.saveMap "ze map"
            ]

        cmd =
            Cmd.batch
                [ Viewport.getWindowSize OnResize
                , Tileset.Bulkhead.load (\base -> "static/" ++ base ++ ".png") OnTilesetLoad
                ]
    in
    ( model, cmd )



-- update


viewport : Model -> Viewport
viewport model =
    { pixelSize = model.viewportPixelSize
    , minimumVisibleWorldSize = { width = model.minimumVisibleWorldSize, height = model.minimumVisibleWorldSize }
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            noCmd model

        OnResize size ->
            { model | viewportPixelSize = size }
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
                    Viewport.pixelToWorld (viewport model) pixelPosition
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
            let
                speed =
                    1.2

                f =
                    if deltaY > 0 then
                        speed
                    else
                        1 / speed
            in
            { model | minimumVisibleWorldSize = f * model.minimumVisibleWorldSize }
                |> noCmd

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
                { model | selectedTileType = id }

        OnTilesetLoad result ->
            case result of
                Err err ->
                    Debug.todo err

                Ok tileset ->
                    { model | maybeTileset = Just tileset }
                        |> loadMap tileset model.flags.localStorageMap
                        |> noCmd


loadMap : Tileset -> String -> Model -> Model
loadMap tileset mapAsString model =
    let
        { tiles, pois } =
            case Json.Decode.decodeString (mapDecoder tileset) mapAsString of
                Ok stuff ->
                    stuff

                Err error ->
                    let
                        _ =
                            Debug.log "no map" error
                    in
                    { tiles = Dict.empty
                    , pois = Dict.empty
                    }

        { minX, maxX, minY, maxY } =
            mapBoundaries tiles
                |> Debug.log "bounds"
    in
    { model
        | tiles = tiles
        , pois = pois
        , cameraPosition =
            { x = 0.5 * toFloat (maxX + minX)
            , y = 0.5 * toFloat (maxY + minY)
            }
    }


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

                        ( ModeTiles, Keyboard.Character "p" ) ->
                            { model | patternMode = not model.patternMode }

                        ( ModeTiles, Keyboard.Character "D" ) ->
                            toggleDelete model

                        ( ModeTiles, Keyboard.Character "A" ) ->
                            { model | alternativeMode = not model.alternativeMode }

                        -- Mode: Pois
                        ( ModePois, Keyboard.Character "a" ) ->
                            model |> addPoi

                        ( ModePois, Keyboard.Character "d" ) ->
                            model |> deletePoi

                        _ ->
                            model

            _ ->
                model


toggleDelete : Model -> Model
toggleDelete model =
    if model.selectedTileType.render == Tileset.RenderEmpty then
        { model | selectedTileType = model.previousSelectedTileType }
    else
        let
            isEmpty tileType =
                (tileType.render == Tileset.RenderEmpty)
                    && (tileType.maybeBlocker == Nothing)
                    && (tileType.layer == model.selectedTileType.layer)

            maybeEmptyTile =
                model.maybeTileset
                    |> Maybe.andThen (\tileset -> List.Extra.find isEmpty tileset.tileTypes)
        in
        case maybeEmptyTile of
            Nothing ->
                model

            Just empty ->
                { model
                    | selectedTileType = empty
                    , previousSelectedTileType = model.selectedTileType
                }


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


getUndoSnapshot : Model -> MapState
getUndoSnapshot { pois, tiles } =
    { pois = pois
    , tiles = tiles
    }


setUndoSnapshot : MapState -> Model -> Model
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
    case model.maybeTileset of
        Nothing ->
            model

        Just tileset ->
            let
                index =
                    tileset.tileTypes
                        |> List.sortBy .id
                        |> List.Extra.findIndex ((==) model.selectedTileType)
                        |> Maybe.withDefault 0

                cols =
                    tileset.spriteCols

                rows =
                    tileset.spriteRows

                left =
                    modBy cols <| modBy cols index + dl + cols

                bottom =
                    modBy rows <| (index // cols) + db + rows

                tileType =
                    tileset.tileTypes
                        |> List.Extra.getAt (left + bottom * cols)
                        |> Maybe.withDefault
                            { id = -1
                            , render = Tileset.RenderEmpty
                            , maybeBlocker = Just Tileset.BlockerFourSides
                            , layer = 0
                            , alternativeGroupId = 0
                            , maybePatternFragment = Nothing
                            }
            in
            { model | selectedTileType = tileType }


replaceTile : Model -> Model
replaceTile model =
    let
        position =
            model.mouseWorldPosition

        tileType1 =
            case ( model.patternMode, model.selectedTileType.maybePatternFragment ) of
                ( True, Just fragment ) ->
                    findTileThatMatchesPattern fragment.patternId model

                _ ->
                    model.selectedTileType

        ( tileType2, model2 ) =
            if model.alternativeMode && model.selectedTileType.alternativeGroupId /= 0 then
                pickRandomAlternative tileType1 model
            else
                ( tileType1, model )

        tiles =
            Dict.insert ( model.selectedTileType.layer, round position.x, round position.y ) tileType2 model.tiles
    in
    { model2 | tiles = tiles }


pickRandomAlternative : TileType -> Model -> ( TileType, Model )
pickRandomAlternative tileType model =
    case model.maybeTileset of
        Nothing ->
            ( tileType, model )

        Just tileset ->
            let
                alternatives =
                    tileset.tileTypes
                        |> List.filter (\t -> t.alternativeGroupId == model.selectedTileType.alternativeGroupId)

                ( maybeAlt, seed ) =
                    Random.step (Random.Extra.sample alternatives) model.seed

                alt =
                    Maybe.withDefault tileType maybeAlt
            in
            ( alt, { model | seed = seed } )


findTileThatMatchesPattern : Int -> Model -> TileType
findTileThatMatchesPattern patternId model =
    case model.maybeTileset of
        Nothing ->
            model.selectedTileType

        Just tileset ->
            let
                col =
                    round model.mouseWorldPosition.x

                row =
                    round model.mouseWorldPosition.y

                hasPattern dc dr =
                    case Dict.get ( model.selectedTileType.layer, col + dc, row + dr ) model.tiles of
                        Nothing ->
                            False

                        Just tileType ->
                            case tileType.maybePatternFragment of
                                Nothing ->
                                    False

                                Just fragment ->
                                    fragment.patternId == patternId

                requiredFragment =
                    { patternId = patternId
                    , left = hasPattern -1 0
                    , right = hasPattern 1 0
                    , up = hasPattern 0 1
                    , down = hasPattern 0 -1
                    }

                matchesRequiredClosedSides tileType =
                    tileType.maybePatternFragment == Just requiredFragment
            in
            tileset.tileTypes
                |> List.Extra.find matchesRequiredClosedSides
                |> Maybe.withDefault model.selectedTileType



-- Rows / Columns duplicate / remove -----------------------------------------


mapBoundaries : Dict MapTileCoordinate a -> MapBoundaries
mapBoundaries tiles =
    let
        ( xs, ys ) =
            tiles
                |> Dict.keys
                |> List.map (\( layer, left, bottom ) -> ( left, bottom ))
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


boundaries_fold : (MapTileCoordinate -> a -> a) -> a -> MapBoundaries -> a
boundaries_fold fun zero { minX, maxX, minY, maxY } =
    let
        foldX x accum =
            List.range minY maxY
                |> List.foldl (foldY x) accum

        foldY x y accum =
            accum
                |> fun ( 0, x, y )
                |> fun ( 1, x, y )
    in
    List.range minX maxX
        |> List.foldl foldX zero


transfer : (MapBoundaries -> MapBoundaries) -> (MapTileCoordinate -> MapTileCoordinate) -> Model -> Model
transfer updateBounds destinationToSourcePair model =
    let
        tiles =
            model.tiles
                |> mapBoundaries
                |> updateBounds
                |> boundaries_fold copyTiles Dict.empty

        copyTiles dest ts =
            Dict.update dest (\unused -> Dict.get (destinationToSourcePair dest) model.tiles) ts
    in
    -- TODO: also modify pois
    { model | tiles = tiles }
        |> pushUndoSnapshotFrom model


duplicateColumn : Int -> Model -> Model
duplicateColumn column model =
    let
        updateBounds bounds =
            { bounds | maxX = bounds.maxX + 1 }

        destinationToSourcePair ( layer, destX, destY ) =
            ( layer
            , if destX <= column then
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

        destinationToSourcePair ( layer, destX, destY ) =
            ( layer
            , if destX < column then
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

        destinationToSourcePair ( layer, destX, destY ) =
            ( layer
            , destX
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

        destinationToSourcePair ( layer, destX, destY ) =
            ( layer
            , destX
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


redShader : Shader {} Uniforms Varying
redShader =
    [glsl|
        precision mediump float;
        precision mediump int;

        uniform sampler2D tileSprites;
        uniform mat4 entityToTexture;

        varying vec2 localPosition;
        varying vec2 worldPosition;

        void main () {
          gl_FragColor = vec4(1, 0, 0, 1);
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


spritesPalette : Tileset -> Model -> ( List WebGL.Entity, List (Svg Msg) )
spritesPalette tileset model =
    let
        w =
            toFloat tileset.spriteCols

        h =
            toFloat tileset.spriteRows

        indexToPalettePosition index =
            { x = toFloat (modBy tileset.spriteCols index)
            , y = toFloat (index // tileset.spriteCols)
            }

        visibleWorldSize =
            Viewport.actualVisibleWorldSize (viewport model)

        paletteLeft =
            -(visibleWorldSize.width / 2) + 1

        paletteBottom =
            (visibleWorldSize.height / 2) - toFloat tileset.spriteRows - 1

        worldToCamera =
            model
                |> viewport
                |> Viewport.worldToCameraTransform
                |> Mat4.translate3 paletteLeft paletteBottom 0

        background =
            Svgl.Primitives.rect
                { sh = 0
                , entityToWorld = Mat4.makeTranslate3 (w / 2) (h / 2) 0
                , worldToCamera = worldToCamera
                , darknessFocus = vec2 0 0
                , darknessIntensity = 0
                , dimensions = vec2 w h
                , fill = vec4 1 1 1 1
                , stroke = vec4 1 1 1 1
                , strokeWidth = 0
                , opacity = 0.5
                }
    in
    ( tileset.tileTypes
        |> List.indexedMap (drawTile tileset worldToCamera)
        |> (::) background
    , tileset.tileTypes
        |> List.indexedMap (drawTileOverlay model tileset worldToCamera)
    )


drawTileOverlay : Model -> Tileset -> Mat4 -> Int -> TileType -> Svg Msg
drawTileOverlay model tileset worldToCamera index tileType =
    let
        selectedType =
            model.selectedTileType

        -- position in the palette
        paletteX =
            toFloat (modBy tileset.spriteCols index)

        paletteY =
            toFloat (index // tileset.spriteCols)

        entityToCamera =
            worldToCamera
                |> Mat4.translate3 paletteX paletteY 0

        isPatternSelected =
            Maybe.map2 (\frag selectedFrag -> frag.patternId == selectedFrag.patternId)
                tileType.maybePatternFragment
                selectedType.maybePatternFragment
                |> Maybe.withDefault False

        isAlternativeSelected =
            model.alternativeMode
                && (tileType.alternativeGroupId /= 0)
                && (tileType.alternativeGroupId == selectedType.alternativeGroupId)

        strokeColor =
            if tileType == selectedType || isAlternativeSelected then
                "red"
            else
                "none"

        strokeDasharray =
            if isAlternativeSelected then
                SA.strokeDasharray "0.2 0.2"
            else
                SA.style ""

        fillColor =
            if isPatternSelected && model.patternMode then
                "rgba(255, 0, 0, 0.3)"
            else
                "none"
    in
    Svg.rect
        [ Viewport.Combine.transform entityToCamera
        , SA.fill fillColor
        , SA.stroke strokeColor
        , SA.strokeWidth "0.1"
        , strokeDasharray
        , SA.width "1"
        , SA.height "1"

        --TODO how do I avoid inserting a tile when I click on a tile type? --, Html.Events.onClick
        ]
        []


drawTile : Tileset -> Mat4 -> Int -> TileType -> WebGL.Entity
drawTile tileset worldToCamera index tileType =
    let
        -- position in the palette
        paletteX =
            toFloat (modBy tileset.spriteCols index)

        paletteY =
            toFloat (index // tileset.spriteCols)

        entityToWorld =
            Mat4.identity
                |> Mat4.translate3 (paletteX + 0.5) (paletteY + 0.5) 0
    in
    case tileType.render of
        Tileset.RenderEmpty ->
            WebGL.entityWith
                --TODO show empty or red box if blocker
                settings
                quadVertexShader
                redShader
                Svgl.Primitives.normalizedQuadMesh
                { entityToWorld = entityToWorld
                , worldToCamera = worldToCamera
                , entityToTexture = Mat4.identity
                , tileSprites = tileset.spriteTexture
                }

        Tileset.RenderStatic ( spriteLeft, spriteBottom ) ->
            let
                -- position in the spritesheet texture
                tOffX =
                    toFloat spriteLeft

                tOffY =
                    toFloat spriteBottom

                scale =
                    1 / toFloat (max tileset.spriteCols tileset.spriteRows)

                entityToTexture =
                    Mat4.identity
                        |> Mat4.scale3 scale scale 1
                        |> Mat4.translate3 (tOffX + 0.5) (tOffY + 0.5) 0
            in
            WebGL.entityWith
                settings
                quadVertexShader
                fragmentShader
                Svgl.Primitives.normalizedQuadMesh
                { entityToWorld = entityToWorld
                , worldToCamera = worldToCamera
                , entityToTexture = entityToTexture
                , tileSprites = tileset.spriteTexture
                }



-- Scene ---------------------------------------------------------------------


entities : Tileset -> Model -> ( List WebGL.Entity, List (Svg Msg) )
entities tileset model =
    let
        worldToCamera =
            model
                |> viewport
                |> Viewport.worldToCameraTransform
                |> Mat4.translate3 -model.cameraPosition.x -model.cameraPosition.y 0

        -- Tiles
        tilesEntities =
            model.tiles
                |> Dict.toList
                |> List.sortBy (\( ( layer, tileX, tileY ), tileType ) -> layer)
                |> List.filterMap (renderMapTile worldToCamera tileset)

        ( paletteEntities, paletteSvg ) =
            case model.mode of
                ModeTiles ->
                    spritesPalette tileset model

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


renderMapTile : Mat4 -> Tileset -> ( MapTileCoordinate, TileType ) -> Maybe WebGL.Entity
renderMapTile worldToCamera tileset ( ( layer, tileX, tileY ), tileType ) =
    case tileType.render of
        Tileset.RenderEmpty ->
            Nothing

        Tileset.RenderStatic ( spriteLeft, spriteBottom ) ->
            let
                entityToTexture =
                    Mat4.identity
                        |> Mat4.scale3 (1 / toFloat tileset.spriteCols) (1 / toFloat tileset.spriteCols) 1
                        |> Mat4.translate3 (toFloat spriteLeft + 0.5) (toFloat spriteBottom + 0.5) 0

                entityToWorld =
                    Mat4.identity
                        |> Mat4.translate3 (toFloat tileX) (toFloat tileY) 0
            in
            { entityToWorld = entityToWorld
            , worldToCamera = worldToCamera
            , entityToTexture = entityToTexture
            , tileSprites = tileset.spriteTexture
            }
                |> WebGL.entityWith
                    settings
                    quadVertexShader
                    fragmentShader
                    Svgl.Primitives.normalizedQuadMesh
                |> Just


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
    { title = "Generic platformer"
    , body =
        case model.maybeTileset of
            Nothing ->
                []

            Just tileset ->
                let
                    ( webGlEntities, svgContent ) =
                        entities tileset model
                in
                [ Viewport.Combine.wrapper
                    { viewportSize = model.viewportPixelSize
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


main =
    Browser.document
        { view = view
        , subscriptions = subscriptions
        , update = update
        , init = init
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
