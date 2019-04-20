module Editor exposing (..)

{-
   - On highlighted element and all its descendants:
      - ArrowUp, ArrowDown: sibling up, down
      - R: reparent (select new parent)
      - Del: delete
      - A: add child
      - Space: cycle primitive (none, rect, ellipse)
      - Enter: set name

   - automatic per-group colors
   - background image

   - save, load
   - export Elm
-}

import Browser
import Browser.Events
import Dict exposing (Dict)
import Html exposing (Html, div, span, text)
import Html.Attributes exposing (class, style)
import Html.Events
import Json.Decode exposing (Decoder)
import Keyboard
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Set exposing (Set)
import Svgl.Primitives exposing (PrimitiveShape(..), defaultUniforms)
import Viewport exposing (PixelPosition, PixelSize, WorldSize)
import WebGL


{-| TODO Move this in Viewport?
-}
recordToVec3 : Viewport.WorldPosition -> Vec3
recordToVec3 { x, y } =
    vec3 x y 0



-- Types


type alias Id =
    Int


type alias Model =
    { maybeViewportSize : Maybe PixelSize
    , visibleWorldSize : WorldSize
    , elementsById : Dict Id Element

    --
    , keys : List Keyboard.Key
    , mousePosition : PixelPosition
    , maybeDragging : Maybe Drag
    , maybeMouseHoverElement : Maybe Id
    }


type alias Drag =
    { targetId : Id
    , startingMousePosition : PixelPosition
    , startingElementsById : Dict Id Element
    , mode : DragAction
    }


type DragAction
    = DragTranslate
    | DragRotate


type Msg
    = OnResize PixelSize
    | OnKey Keyboard.Msg
    | OnMouseDown
    | OnMouseMove PixelPosition
    | OnMouseUp
    | OnMouseEnter Id
    | OnMouseLeave Id


{-| TODO rename to 'node' ?
-}
type alias Element =
    { id : Id
    , name : String
    , elementToParent : Mat4
    , children : List Id
    , color : Vec3
    , w : Float
    , h : Float
    , maybeShape : Maybe PrimitiveShape
    }



-- UI init


initElements : List Element
initElements =
    [ { id = 0
      , name = "something"
      , elementToParent =
            Mat4.identity
                |> matRotate (pi / 3)
                |> matTranslate (vec3 0.2 -0.3 0.1)
      , children = [ 1, 2 ]
      , maybeShape = Just Rectangle
      , w = 0.2
      , h = 0.1
      , color = vec3 0 1 0
      }
    , { id = 1
      , name = "something"
      , elementToParent =
            Mat4.identity
                |> Mat4.translate3 0.3 0.1 0
                |> matRotate (pi / 8)
      , children = []
      , maybeShape = Just Rectangle
      , w = 2
      , h = 0.4
      , color = vec3 1 0 0
      }
    , { id = 2
      , name = "something"
      , elementToParent =
            Mat4.identity
                |> Mat4.translate3 0.5 0 0
                |> matRotate (pi / 9)
      , children = []
      , maybeShape = Just Rectangle
      , w = 2
      , h = 0.4
      , color = vec3 0 0 1
      }
    ]



-- UI


cancelDragging : Model -> Model
cancelDragging model =
    case model.maybeDragging of
        Nothing ->
            model

        Just dragging ->
            { model
                | maybeDragging = Nothing
                , elementsById = dragging.startingElementsById
            }


updateOnMouseDown : Model -> Model
updateOnMouseDown model =
    case selectedElementId model of
        Nothing ->
            model

        Just elementId ->
            { model
                | maybeDragging =
                    Just
                        { targetId = elementId
                        , startingMousePosition = model.mousePosition
                        , startingElementsById = model.elementsById
                        , mode =
                            if List.member Keyboard.Shift model.keys then
                                DragRotate
                            else
                                DragTranslate
                        }
            }


updateOnMouseMove : Model -> Model
updateOnMouseMove model =
    case Maybe.map2 Tuple.pair model.maybeDragging model.maybeViewportSize of
        Nothing ->
            model

        Just ( dragging, viewportSize ) ->
            case dragging.mode of
                DragRotate ->
                    updateOnMouseMoveRotate dragging viewportSize model

                DragTranslate ->
                    updateOnMouseMoveTranslate dragging viewportSize model


updateOnMouseMoveRotate : Drag -> Viewport.PixelSize -> Model -> Model
updateOnMouseMoveRotate dragging viewportSize model =
    case getResolved dragging.startingElementsById Mat4.identity dragging.targetId of
        Nothing ->
            { model | maybeDragging = Nothing }

        Just ( worldToElement_initial, element ) ->
            let
                element_world_position_initial =
                    matToTranslation worldToElement_initial

                viewport =
                    { pixelSize = viewportSize
                    , minimumVisibleWorldSize = model.visibleWorldSize
                    }

                mouse_world_position_initial =
                    dragging.startingMousePosition
                        |> Viewport.pixelToWorld viewport
                        |> recordToVec3

                worldToElement_rotation_initial =
                    vectorToAngle (Vec3.sub mouse_world_position_initial element_world_position_initial)

                mouse_world_position_target =
                    model.mousePosition
                        |> Viewport.pixelToWorld viewport
                        |> recordToVec3

                worldToElement_rotation_target =
                    vectorToAngle (Vec3.sub mouse_world_position_target element_world_position_initial)

                deltaRotation =
                    worldToElement_rotation_target - worldToElement_rotation_initial

                element_world_position_target =
                    matToTranslation worldToElement_initial

                element_world_rotation_target =
                    matToAngle worldToElement_initial + deltaRotation

                worldToElement_target =
                    Mat4.identity
                        |> matTranslate element_world_position_target
                        |> matRotate element_world_rotation_target

                elementToParent_target =
                    elementParentToElement dragging.startingElementsById element.id worldToElement_target
            in
            model
                |> updateElement { element | elementToParent = elementToParent_target }


updateOnMouseMoveTranslate : Drag -> Viewport.PixelSize -> Model -> Model
updateOnMouseMoveTranslate dragging viewportSize model =
    case getResolved dragging.startingElementsById Mat4.identity dragging.targetId of
        Nothing ->
            { model | maybeDragging = Nothing }

        Just ( worldToElement_initial, element ) ->
            let
                element_world_position_initial =
                    matToTranslation worldToElement_initial

                viewport =
                    { pixelSize = viewportSize
                    , minimumVisibleWorldSize = model.visibleWorldSize
                    }

                mouse_world_position_initial =
                    dragging.startingMousePosition
                        |> Viewport.pixelToWorld viewport
                        |> recordToVec3

                mouse_world_position_target =
                    model.mousePosition
                        |> Viewport.pixelToWorld viewport
                        |> recordToVec3

                mouse_world_dp =
                    Vec3.sub mouse_world_position_target mouse_world_position_initial

                element_world_position_target =
                    Vec3.add element_world_position_initial mouse_world_dp

                element_world_rotation_target =
                    matToAngle worldToElement_initial

                worldToElement_target =
                    Mat4.identity
                        |> matTranslate element_world_position_target
                        |> matRotate element_world_rotation_target

                elementToParent_target =
                    elementParentToElement dragging.startingElementsById element.id worldToElement_target
            in
            model
                |> updateElement { element | elementToParent = elementToParent_target }



--|> updateElement { element | elementToParent = updatedWorldToElement, children = [], id = 6 }


updateElement : Element -> Model -> Model
updateElement element model =
    { model | elementsById = Dict.insert element.id element model.elementsById }


updateOnMouseUp : Model -> Model
updateOnMouseUp model =
    { model | maybeDragging = Nothing }


updateOnKeyChange : Keyboard.KeyChange -> Model -> ( Model, Cmd Msg )
updateOnKeyChange keyChange model =
    case keyChange of
        Keyboard.KeyDown key ->
            noCmd model

        Keyboard.KeyUp key ->
            case Debug.log "KEY" key of
                Keyboard.Escape ->
                    model
                        |> cancelDragging
                        |> noCmd

                Keyboard.ArrowUp ->
                    model
                        |> moveSibling -1
                        |> noCmd

                Keyboard.ArrowDown ->
                    model
                        |> moveSibling 1
                        |> noCmd

                _ ->
                    noCmd model



-- siblings


moveItem : Int -> a -> List a -> List a
moveItem deltaIndex item list =
    case List.Extra.elemIndex item list of
        Nothing ->
            list

        Just index ->
            List.Extra.swapAt index (index + deltaIndex) list


moveSibling : Int -> Model -> Model
moveSibling deltaIndex model =
    case selectedElementId model of
        Nothing ->
            model

        Just elementId ->
            case getParent model.elementsById elementId of
                Nothing ->
                    model

                Just parent ->
                    updateElement { parent | children = moveItem deltaIndex elementId parent.children } model



-- selection


selectedElementId : Model -> Maybe Id
selectedElementId model =
    case model.maybeMouseHoverElement of
        Just id ->
            Just id

        Nothing ->
            findElementUnderMouse model
                |> Maybe.map .id



-- geo


findElementUnderMouse : Model -> Maybe Element
findElementUnderMouse model =
    case model.maybeViewportSize of
        Nothing ->
            Nothing

        Just viewportSize ->
            let
                mouseWorldPosition =
                    Viewport.pixelToWorld
                        { pixelSize = viewportSize
                        , minimumVisibleWorldSize = model.visibleWorldSize
                        }
                        model.mousePosition

                mouseWorldPositionVec =
                    vec3 mouseWorldPosition.x mouseWorldPosition.y 0

                elementIsUnderMouse ( elementToWorld, element ) =
                    mouseWorldPositionVec
                        |> Mat4.transform (inverseOrIdentity elementToWorld)
                        |> elementCoversCameraPoint element
            in
            model.elementsById
                |> resolvePositions Mat4.identity
                |> List.filter elementIsUnderMouse
                |> List.map Tuple.second
                |> List.reverse
                |> List.head


elementCoversCameraPoint : Element -> Vec3 -> Bool
elementCoversCameraPoint element positionInElementCoordinates =
    case element.maybeShape of
        Nothing ->
            False

        Just shape ->
            let
                { x, y, z } =
                    Vec3.toRecord positionInElementCoordinates

                ww =
                    element.w / 2

                hh =
                    element.h / 2
            in
            case shape of
                Rectangle ->
                    x >= -ww && x <= ww && y >= -hh && y <= hh

                Ellipse ->
                    (x / ww) ^ 2 + (y / hh) ^ 2 <= 1

                RightTriangle ->
                    Debug.todo "Right Triangles are missing!"


{-|

    Case:
      I have the mouse position in world coordinates, I need to find
      the mouse position in element coordinates to see if mouse is
      hovering element

    Case:
      I am moving an element.
      Movement is expressed in world coordinates, but the model stores
      position relative to parent element.
      I need to convert from world coordinates to coordinates relative
      to resolved parent transform.

-}
elementParentToElement : Dict Id Element -> Id -> Mat4 -> Mat4
elementParentToElement elementsById elementId worldToChild =
    case getParent elementsById elementId of
        Nothing ->
            worldToChild

        Just parent ->
            case getResolved elementsById Mat4.identity parent.id of
                Nothing ->
                    Debug.todo "no element!"

                Just ( worldToParent, parent_ ) ->
                    case Mat4.inverse worldToParent of
                        Nothing ->
                            Debug.todo "worldToParent not invertible!?"

                        Just parentToWorld ->
                            Mat4.mul parentToWorld worldToChild



-- Matrices


inverseOrIdentity : Mat4 -> Mat4
inverseOrIdentity mat =
    case Mat4.inverse mat of
        Nothing ->
            Debug.todo "mat is not invertible"

        Just inverse ->
            inverse


vectorToAngle : Vec3 -> Float
vectorToAngle v =
    let
        { x, y, z } =
            Vec3.toRecord v
    in
    atan2 -y x


matToAngle : Mat4 -> Float
matToAngle mat =
    let
        { m11, m12 } =
            Mat4.toRecord mat
    in
    atan2 m12 m11


matRotate : Float -> Mat4 -> Mat4
matRotate angle =
    Mat4.rotate angle (vec3 0 0 -1)


matToTranslation : Mat4 -> Vec3
matToTranslation mat =
    let
        { m14, m24, m34 } =
            Mat4.toRecord mat
    in
    vec3 m14 m24 m34


matTranslate : Vec3 -> Mat4 -> Mat4
matTranslate =
    Mat4.translate


setRotation : Float -> Mat4 -> Mat4
setRotation angle original =
    Mat4.identity
        |> matTranslate (matToTranslation original)
        |> matRotate angle


setTranslation : Vec3 -> Mat4 -> Mat4
setTranslation v original =
    Mat4.identity
        |> Mat4.translate v
        |> matRotate (matToAngle original)



-- Tree helpers


getResolved : Dict Id Element -> Mat4 -> Id -> Maybe ( Mat4, Element )
getResolved elementsById worldToSomething id =
    elementsById
        |> resolvePositions Mat4.identity
        |> List.Extra.find (\( m, e ) -> e.id == id)


getParent : Dict Id Element -> Id -> Maybe Element
getParent elementsById id =
    elementsById
        |> Dict.values
        |> List.Extra.find (\el -> List.any (\childId -> childId == id) el.children)


parentByElementId : Dict Id Element -> Dict Id Element
parentByElementId elementsById =
    let
        insertAsParent parent childId accum =
            Dict.insert childId parent accum

        insertChildren elementId element accum =
            List.foldl (insertAsParent element) accum element.children
    in
    elementsById
        |> Dict.foldl insertChildren Dict.empty


rootElementIds : Dict Id Element -> List Id
rootElementIds elementsById =
    let
        allIds =
            Dict.keys elementsById
                |> Set.fromList

        removeChildrenIds id element set =
            List.foldl Set.remove set element.children
    in
    elementsById
        |> Dict.foldl removeChildrenIds allIds
        |> Set.toList



-- Tree resolution


resolvePositions : Mat4 -> Dict Id Element -> List ( Mat4, Element )
resolvePositions worldToSomething elementsById =
    elementsById
        |> rootElementIds
        |> List.concatMap (\rootElementId -> resolvePositionsRecursive elementsById worldToSomething rootElementId [])


resolvePositionsRecursive : Dict Id Element -> Mat4 -> Id -> List ( Mat4, Element ) -> List ( Mat4, Element )
resolvePositionsRecursive oldElementsById parentToRoot elementId accumulator =
    case Dict.get elementId oldElementsById of
        Nothing ->
            accumulator

        Just element ->
            let
                -- Loops should not happen, but just in case...
                newElementsById =
                    Dict.remove element.id oldElementsById

                elementToRoot =
                    Mat4.mul parentToRoot element.elementToParent
            in
            List.foldr (resolvePositionsRecursive newElementsById elementToRoot) (( elementToRoot, element ) :: accumulator) element.children



-- View


view : Model -> Browser.Document Msg
view model =
    { title = "2D Mesh Editor"
    , body =
        case model.maybeViewportSize of
            Nothing ->
                []

            Just viewportSize ->
                let
                    maybeSelectedElementId =
                        selectedElementId model

                    worldToCamera =
                        Viewport.worldToCameraTransform
                            { pixelSize = viewportSize
                            , minimumVisibleWorldSize = model.visibleWorldSize
                            }

                    renderElement ( elementToWorld, element ) =
                        elementToWebGLEntity maybeSelectedElementId worldToCamera elementToWorld element
                in
                [ resolvePositions Mat4.identity model.elementsById
                    |> List.filterMap renderElement
                    |> toFullWindowHtml viewportSize
                , div
                    [ class "overlay" ]
                    [ viewTree model ]
                ]
    }


toFullWindowHtml : Viewport.PixelSize -> List WebGL.Entity -> Html a
toFullWindowHtml pixelSize entities =
    div
        [ style "width" "100vw"
        , style "height" "100vh"
        , style "overflow" "hidden"
        ]
        [ WebGL.toHtmlWith
            [ WebGL.alpha True
            , WebGL.antialias
            , WebGL.clearColor 0 0 0 1
            ]
            [ style "width" "100vw"
            , style "height" "100vh"
            , Html.Attributes.width pixelSize.width
            , Html.Attributes.height pixelSize.height
            ]
            entities
        ]


elementColor : Maybe Id -> Element -> Vec3
elementColor maybeSelectedElementId element =
    if maybeSelectedElementId == Just element.id then
        vec3 1 1 1
    else
        element.color


elementToWebGLEntity : Maybe Id -> Mat4 -> Mat4 -> Element -> Maybe WebGL.Entity
elementToWebGLEntity maybeSelectedId worldToCamera elementToWorld element =
    let
        color =
            elementColor maybeSelectedId element
    in
    element.maybeShape
        |> Maybe.map
            (\shape ->
                Svgl.Primitives.shape shape
                    { defaultUniforms
                        | entityToWorld = elementToWorld
                        , worldToCamera = worldToCamera
                        , dimensions = vec2 element.w element.h
                        , fill = Vec3.scale 0.5 color
                        , stroke = color
                    }
            )


viewTree : Model -> Html Msg
viewTree model =
    let
        maybeSelectedElementId =
            selectedElementId model
    in
    model.elementsById
        |> rootElementIds
        |> List.foldr (viewBranch maybeSelectedElementId model.elementsById 0) []
        |> Html.div [ class "column" ]


viewBranch : Maybe Id -> Dict Id Element -> Int -> Id -> List (Html Msg) -> List (Html Msg)
viewBranch maybeSelectedElementId elementsById depth rootId accumulator =
    case Dict.get rootId elementsById of
        Nothing ->
            accumulator

        Just element ->
            viewRow maybeSelectedElementId depth element :: List.foldr (viewBranch maybeSelectedElementId elementsById (depth + 1)) accumulator element.children


colorVecToHtml : Vec3 -> String
colorVecToHtml v =
    let
        { x, y, z } =
            Vec3.toRecord v

        s n =
            n * 255 |> String.fromFloat
    in
    "rgb(" ++ s x ++ ", " ++ s y ++ ", " ++ s z ++ ")"


viewRow : Maybe Id -> Int -> Element -> Html Msg
viewRow maybeSelectedElementId depth element =
    let
        color =
            elementColor maybeSelectedElementId element
    in
    div
        [ class "tree-row"
        , style "background-color" (color |> Vec3.scale 0.5 |> colorVecToHtml)
        , style "color" (color |> Vec3.scale 1 |> colorVecToHtml)
        , Html.Events.onMouseEnter (OnMouseEnter element.id)
        , Html.Events.onMouseLeave (OnMouseLeave element.id)
        ]
        [ span [ class "indent" ] []
            |> List.repeat depth
            |> span []
        , viewPrimitiveLabel element
        , text element.name
        ]


viewPrimitiveLabel : Element -> Html Msg
viewPrimitiveLabel el =
    text <|
        case el.maybeShape of
            Nothing ->
                "∅"

            Just shape ->
                case shape of
                    Ellipse ->
                        "⬭"

                    Rectangle ->
                        "▭"

                    RightTriangle ->
                        "⊿"



-- Main


init : {} -> ( Model, Cmd Msg )
init flags =
    let
        model =
            { maybeViewportSize = Nothing
            , visibleWorldSize = { width = 2, height = 2 }
            , keys = []
            , mousePosition = { top = 0, left = 0 }
            , elementsById = initElements |> List.map (\e -> ( e.id, e )) |> Dict.fromList
            , maybeDragging = Nothing
            , maybeMouseHoverElement = Nothing
            }

        cmd =
            Viewport.getWindowSize OnResize
    in
    ( model, cmd )


noCmd : Model -> ( Model, Cmd Msg )
noCmd model =
    ( model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnResize size ->
            noCmd { model | maybeViewportSize = Just size }

        OnKey keymsg ->
            let
                ( keys, maybeKeyChange ) =
                    Keyboard.updateWithKeyChange Keyboard.anyKey keymsg model.keys
            in
            { model | keys = keys }
                |> (case maybeKeyChange of
                        Nothing ->
                            noCmd

                        Just keyChange ->
                            updateOnKeyChange keyChange
                   )

        OnMouseDown ->
            model
                |> updateOnMouseDown
                |> noCmd

        OnMouseMove position ->
            { model | mousePosition = position }
                |> updateOnMouseMove
                |> noCmd

        OnMouseUp ->
            model
                |> updateOnMouseUp
                |> noCmd

        OnMouseEnter id ->
            noCmd { model | maybeMouseHoverElement = Just id }

        OnMouseLeave id ->
            if model.maybeMouseHoverElement == Just id then
                noCmd { model | maybeMouseHoverElement = Nothing }
            else
                noCmd model



-- Subscriptions


mousePositionDecoder : Decoder PixelPosition
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
        , Browser.Events.onMouseDown (Json.Decode.succeed OnMouseDown)
        , Browser.Events.onMouseUp (Json.Decode.succeed OnMouseUp)
        ]


main =
    Browser.document
        { view = view
        , subscriptions = subscriptions
        , update = update
        , init = init
        }
