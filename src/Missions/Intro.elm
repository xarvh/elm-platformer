module Missions.Intro exposing (init)

import Baloon
import Dict exposing (Dict)
import Entities.Drone
import Game exposing (..)
import Maps.Intro
import PlayerMain
import Svg exposing (Svg)
import Svg.Attributes as SA
import Svgl.Tree exposing (defaultParams, ellipse, rect)
-- import Tiles exposing (SquareCollider)
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
        { game
            | mapWidth = map.width
            , mapHeight = map.height
            , mapTiles = map.tiles
        }
            |> noOut
    , uNewEntity Nothing
        [ PlayerMain.init map.pois.startingPosition
        ]
    , addFadeIn
    , uLater 2 <|
        \env game ->
            uNewEntity (Just game.playerId)
                [ Baloon.init "This is a terrible idea"
                ]
                env
                game
    ]


addFadeIn : UpdateFunction
addFadeIn =
    let
        duration =
            6
    in
    uNewEntity Nothing
        [ \env maybeParent game entity ->
            entity
                |> appendThinkFunctions [{- tTimeToLive duration -}]
                |> appendRenderFunctions [ fadeInRender duration ]
                |> entityOnly game
        ]


fadeInRender : Float -> RenderFunction
fadeInRender duration env game entity =
    let
        age =
            game.time - entity.spawnedAt

        opacity =
            1 - age / duration
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
        |> RenderableSvg
