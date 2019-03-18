module Main exposing (..)

import Assets.Tiles
import Browser
import Browser.Events
import Game exposing (Game)
import GameMain
import Html exposing (Html, div)
import Html.Attributes exposing (class, style)
import Json.Decode exposing (Decoder)
import Keyboard
import Keyboard.Arrows
import Map
import PlayerMain
import Scene
import Svg
import Svg.Attributes as SA
import TileCollision
import Time exposing (Posix)
import Vector exposing (Vector)
import Viewport
import WebGL


-- Types


type alias Flags =
    {}


type alias Model =
    { viewportSize : Viewport.PixelSize
    , mousePosition : Viewport.PixelPosition
    , game : Game
    , keys : List Keyboard.Key
    , pause : Bool
    }


type Msg
    = OnResize Viewport.PixelSize
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

        ( player, game ) =
            Game.new
                |> Game.createAndInitEntity (PlayerMain.init startingPosition)

        model =
            { viewportSize =
                { width = 640
                , height = 480
                }
            , game = { game | playerId = player.id }
            , keys = []
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
        OnResize size ->
            { model | viewportSize = size }
                |> noCmd

        OnKey keymsg ->
            let
                ( keys, maybeKeyChange ) =
                    Keyboard.updateWithKeyChange Keyboard.anyKey keymsg model.keys
            in
            { model | keys = keys }
                |> updateOnKeyChange maybeKeyChange

        OnMouseMove position ->
            { model | mousePosition = position }
                |> noCmd

        OnAnimationFrame dtInMilliseconds ->
            let
                keyboardArrows =
                    Keyboard.Arrows.arrows model.keys

                thinkEnv =
                    { dt = dtInMilliseconds / 1000
                    , inputMove =
                        { x = toFloat keyboardArrows.x
                        , y = toFloat keyboardArrows.y
                        }
                    }

                ( updatedGame, outcomes ) =
                    GameMain.think thinkEnv model.game

                -- TODO: do something with the outcomes
            in
            noCmd { model | game = updatedGame }


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



-- UI HUD


viewTextDialog : Viewport.PixelSize -> String -> Html Msg
viewTextDialog viewportSize content =
    let
        s =
            String.fromFloat

        hudW =
            12

        hudH =
            12

        hhW =
            hudW / 2

        hhH =
            hudH / 2

        margin =
            1

        dialogW =
            hudW - 2 * margin

        dialogH =
            4

        cornerRadius =
            0.3

        dialogX =
            -hudW / 2 + margin

        dialogY =
            hudH / 2 - margin - dialogH

        fontHeight =
            0.5

        lineHeight =
            fontHeight

        textX =
            dialogX + cornerRadius

        textY row =
            dialogY + cornerRadius + (1 + row) * lineHeight
    in
    Svg.svg
        [ SA.class "full-window"
        , Viewport.svgViewBox
            { pixelSize = viewportSize
            , minimumVisibleWorldSize =
                { width = hudW
                , height = hudH
                }
            }
        ]
        [ Svg.rect
            [ dialogX |> s |> SA.x
            , dialogY |> s |> SA.y
            , dialogW |> s |> SA.width
            , dialogH |> s |> SA.height
            , cornerRadius |> s |> SA.ry
            , SA.fill "rgba(50, 50, 255, 0.9)"
            , SA.stroke "rgb(150, 150, 150)"
            , SA.strokeWidth "0.2"
            ]
            []
        , Svg.text_
            [ textX |> s |> SA.x
            , textY 0 |> s |> SA.y
            , SA.fill "rgb(250, 250, 255)"
            , SA.stroke "none" --rgb(250, 250, 150)"
            , SA.class "dialog-text"
            ]
            [ Svg.text "This is super annoying" ]
        , Svg.text_
            [ textX |> s |> SA.x
            , textY 1 |> s |> SA.y
            , SA.fill "rgb(250, 250, 255)"
            , SA.stroke "none" --rgb(250, 250, 150)"
            , SA.class "dialog-text"
            ]
            [ Svg.text "This too is super annoying" ]
        ]



-- View


view : Model -> Browser.Document Msg
view model =
    let
        entities =
            Scene.entities
                { viewportSize = model.viewportSize
                , game = model.game
                }
    in
    { title = "Generic platformer"
    , body =
        [ toFullWindowHtml model.viewportSize entities

        --, viewTextDialog model.viewportSize "LULZ"
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
