module Missions.Intro exposing (init)

import Dict exposing (Dict)
import Entities.Drone
import EntityMain
import Game exposing (..)
import Maps.Intro
import PlayerMain
import SpeechBubble
import Svg exposing (Svg)
import Svg.Attributes as SA
import Svgl.Tree exposing (defaultParams, ellipse, rect)
import TransformTree exposing (..)
import Vector exposing (Vector)


map =
    Maps.Intro.map



-- Components


component =
    componentNamespace "Intro Mission"



-- Init


init : List UpdateFunction
init =
    [ \env game ->
      game
        |> map.set
        |> noOut
    , uNewEntity Nothing
        [ PlayerMain.init map.pois.startingPosition
        ]
    , addFadeIn 3
    , uSeries
        [ zaneSays 1 "Oden! Can you hear me?"
        , odenSays 1 "This is a terrible idea..."
        , zaneSays 1 "ODEN! CAN. YOU. HEAR. ME?"
        , odenSays 0.3 "..."
        , odenSays 0.2 "-sigh-"
        , odenSays 0.2 "Yes Zane, I can hear you loud and clear."
        ]
    ]


uSeries : List (UpdateFunction -> UpdateFunction) -> UpdateFunction
uSeries chainableFunctions env game =
    case chainableFunctions of
        [] ->
            noOut game

        f :: fs ->
            f (uSeries fs) env game


zaneSays : Seconds -> String -> UpdateFunction -> UpdateFunction
zaneSays delay content onDone =
    uLater delay <| SpeechBubble.uNew Nothing content onDone


odenSays : Seconds -> String -> UpdateFunction -> UpdateFunction
odenSays delay content onDone =
    uLater delay <|
        \env game ->
            SpeechBubble.uNew (Just game.playerId) content onDone env game


addFadeIn : Seconds -> UpdateFunction
addFadeIn delay =
    let
        duration =
            6
    in
    uNewEntity Nothing
        [ \env maybeParent game entity ->
            entity
                |> appendEntityUpdateFunctions [ EntityMain.killAfter (delay + duration) ]
                |> appendRenderFunctions [ fadeInRender delay duration ]
                |> entityOnly game
        ]


fadeInRender : Float -> Float -> RenderFunction
fadeInRender delay duration env game entity =
    let
        age =
            game.time - entity.spawnedAt - delay

        opacity =
            1 - age / duration |> min 1
    in
    Svg.rect
        [ SA.x "-1"
        , SA.y "-1"
        , SA.width "2"
        , SA.height "2"
        , SA.fill "black"
        , SA.opacity <| String.fromFloat opacity
        ]
        []
        |> RenderableSvg 1
