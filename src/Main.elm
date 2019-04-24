module Main exposing (..)

import Missions.Intro
import Browser
import Browser.Events
import Game exposing (Game)
import GameMain
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Json.Decode exposing (Decoder)
import Keyboard
import Keyboard.Arrows
import Scene
import Svg exposing (Svg)
import Svg.Attributes as SA
import TileCollision
import Time exposing (Posix)
import Vector exposing (Vector)
import Viewport
import Viewport.Combine
import WebGL


-- Types


type alias Flags =
    {}


type alias Model =
    { viewportSize : Viewport.PixelSize
    , mousePosition : Viewport.PixelPosition
    , game : Game
    , newKeys : List Keyboard.Key
    , oldKeys : List Keyboard.Key
    , pause : Bool
    }


type Msg
    = Noop
    | OnResize Viewport.PixelSize
    | OnAnimationFrame Float
    | OnKey Keyboard.Msg
    | OnMouseMove Viewport.PixelPosition



-- Init


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        -- This should be stored in the Map file
        startingPosition =
            Vector 10 10

        -- TODO do not ignore outcomes?
        ( game, outcomes ) =
            GameMain.init Missions.Intro.init

        model =
            { viewportSize =
                { width = 640
                , height = 480
                }
            , game = game
            , newKeys = []
            , oldKeys = []
            , pause = False
            , mousePosition = { top = 0, left = 0 }
            }

        cmd =
            Viewport.getWindowSize OnResize
    in
    ( model, cmd )



-- Update


noCmd : Model -> ( Model, Cmd Msg )
noCmd model =
    ( model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            noCmd model

        OnResize size ->
            { model | viewportSize = size }
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

        OnMouseMove position ->
            { model | mousePosition = position }
                |> noCmd

        OnAnimationFrame dtInMilliseconds ->
            let
                dt =
                    -- Cap dt to 0.1 second
                    min 100 dtInMilliseconds / 1000

                keyboardArrows =
                    Keyboard.Arrows.arrows model.newKeys

                held key =
                    List.member key model.newKeys

                clicked key =
                    List.member key model.newKeys && not (List.member key model.oldKeys)

                thinkEnv =
                    { dt = dt
                    , inputHoldHorizontalMove = keyboardArrows.x
                    , inputHoldUp = held Keyboard.ArrowUp
                    , inputHoldCrouch = keyboardArrows.y == -1
                    , inputHoldJump = held (Keyboard.Character " ")
                    , inputClickJump = clicked (Keyboard.Character " ")
                    , inputUseGearClick = clicked Keyboard.Control || clicked Keyboard.Enter
                    }

                ( updatedGame, outcomes ) =
                    GameMain.update thinkEnv model.game
            in
            ( { model | game = updatedGame }
            , outcomes
                |> List.concatMap executeOutcome
                |> Cmd.batch
            )


updateOnKeyChange : Maybe Keyboard.KeyChange -> Model -> ( Model, Cmd Msg )
updateOnKeyChange maybeKeyChange model =
    case maybeKeyChange of
        Just (Keyboard.KeyUp key) ->
            case Debug.log "KEY" key of
                Keyboard.Enter ->
                    update (OnAnimationFrame 20) model

                Keyboard.Character "p" ->
                    noCmd { model | pause = not model.pause }

                _ ->
                    noCmd model

        _ ->
            noCmd model



-- Outcomes


executeOutcome : Game.Outcome -> List (Cmd Msg)
executeOutcome o =
    case o of
        Game.OutcomeNone ->
            []

        Game.OutcomeList os ->
            List.concatMap executeOutcome os

        Game.OutcomeLog msg ->
            let
                _ =
                    Debug.log "LOG" msg
            in
            []

        Game.OutcomeCrash msg ->
            Debug.todo msg



-- View


view : Model -> Browser.Document Msg
view model =
    let
        ( webGlEntities, svgContent ) =
            Scene.entities
                { viewportSize = model.viewportSize
                , game = model.game
                }
    in
    { title = "Generic platformer"
    , body =
        [ Viewport.Combine.wrapper
            { viewportSize = model.viewportSize
            , elementAttributes = []
            , webglOptions =
                [ WebGL.alpha True
                , WebGL.antialias
                , WebGL.clearColor 0.2 0.2 0.2 1
                ]
            , webGlEntities = webGlEntities
            , svgContent = List.map (Html.map (\_ -> Noop)) svgContent
            }
        ]
    }



-- Subscriptions


mousePositionDecoder : Decoder Viewport.PixelPosition
mousePositionDecoder =
    Json.Decode.map2 (\x y -> { left = x, top = y })
        (Json.Decode.field "clientX" Json.Decode.int)
        (Json.Decode.field "clientY" Json.Decode.int)


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Viewport.onWindowResize OnResize
        , if model.pause then
            Sub.none
          else
            Browser.Events.onAnimationFrameDelta OnAnimationFrame
        , Keyboard.subscriptions |> Sub.map OnKey
        , Browser.Events.onMouseMove mousePositionDecoder |> Sub.map OnMouseMove
        ]



-- Main


main =
    Browser.document
        { view = view
        , subscriptions = subscriptions
        , update = update
        , init = init
        }
