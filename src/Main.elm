module Main exposing (..)

import Browser
import Browser.Events
import Game
import Html exposing (Html, div)
import Html.Attributes exposing (style)
import Json.Decode exposing (Decoder)
import Keyboard
import Keyboard.Arrows
import Map
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Scene
import TileCollision
import Time exposing (Posix)
import Viewport exposing (PixelPosition, PixelSize)
import WebGL


-- Types


type alias Flags =
    {}


type alias Model =
    { viewportSize : PixelSize
    , currentTimeInSeconds : Float
    , player : Game.Player
    , keys : List Keyboard.Key
    , pause : Bool
    , collisions : List (TileCollision.Collision Map.SquareBlocker)
    }


type Msg
    = OnResize PixelSize
    | OnAnimationFrame Float
    | OnKey Keyboard.Msg



-- Init


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model =
            { viewportSize =
                { width = 640
                , height = 480
                }
            , currentTimeInSeconds = 0
            , player = Game.playerInit
            , keys = []
            , pause = False
            , collisions = []
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
        OnResize size ->
            noCmd { model | viewportSize = size }

        OnKey keymsg ->
            let
                ( keys, maybeKeyChange ) =
                    Keyboard.updateWithKeyChange Keyboard.anyKey keymsg model.keys
            in
            { model | keys = keys }
                |> updateOnKeyChange maybeKeyChange

        OnAnimationFrame dtInMilliseconds ->
            let
                -- dt is in seconds
                dt =
                    dtInMilliseconds / 1000

                (player, collisions) =
                    Game.playerThink dt (Keyboard.Arrows.arrows model.keys) model.player

                pause = Vec2.getX player.speed == 0
            in
            noCmd
                { model
                    | currentTimeInSeconds = model.currentTimeInSeconds + dt
                    --, pause = pause
                    , player = player
                    , collisions = collisions
                }


updateOnKeyChange : Maybe Keyboard.KeyChange -> Model -> ( Model, Cmd Msg )
updateOnKeyChange maybeKeyChange model =
    case maybeKeyChange of
        Just (Keyboard.KeyUp key) ->
            case Debug.log "KEY" key of
                Keyboard.Enter ->
                    let
                        ( m, c ) =
                            update (OnAnimationFrame 20) model

                        q =
                            Debug.log "player" ( model.player.speed, m.player.speed )
                    in
                    ( m, c )

                Keyboard.Character "p" ->
                    noCmd { model | pause = not model.pause }

                _ ->
                    noCmd model

        _ ->
            noCmd model



-- View


view : Model -> Browser.Document Msg
view model =
    let
        visibleWorldSize =
          { width = 20
          , height = 1
          }


        entities =
            Scene.entities
                { cameraToViewport = Viewport.worldToCameraTransform model.viewportSize visibleWorldSize
                , player = model.player
                , collisions = model.collisions
                , time = model.currentTimeInSeconds
                }
    in
    { title = "Generic platformer"
    , body =
        [ Viewport.toFullWindowHtml model.viewportSize entities
        , Html.node "style" [] [ Html.text "body { margin: 0; }" ]
        ]
    }



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
        , if model.pause then
            Sub.none
          else
            Browser.Events.onAnimationFrameDelta OnAnimationFrame
        , Keyboard.subscriptions |> Sub.map OnKey

        --, Browser.Events.onMouseMove mousePositionDecoder |> Sub.map OnMouseMove
        --, Browser.Events.onClick (Json.Decode.succeed OnMouseClick)
        ]



-- Main


main =
    Browser.document
        { view = view
        , subscriptions = subscriptions
        , update = update
        , init = init
        }
