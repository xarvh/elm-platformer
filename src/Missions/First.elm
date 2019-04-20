module Missions.First exposing (init)

import Array exposing (Array)
import Baloon
import Dict exposing (Dict)
import Entities.Drone
import Game exposing (..)
import Maps.ThreeWays as M
import Math.Matrix4 as Mat4
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import PlayerMain
import Quad
import Svg exposing (Svg)
import Svg.Attributes as SA
import Svgl.Tree exposing (defaultParams, ellipse, rect)
import Tiles exposing (SquareCollider)
import TransformTree exposing (..)
import Vector exposing (Vector)


-- Components


component =
    componentNamespace "LevelsFirst"



-- Init


init : List UpdateFunction
init =
    let
        uAddDrone patrolPoints =
            uNewEntity Nothing
                [ Entities.Drone.init patrolPoints
                ]
    in
    [ \env game ->
        { game
            | mapWidth = M.width
            , mapHeight = M.height
            , mapTiles = Array.map Tiles.idToTileType M.tiles
        }
            |> noOut
    , uNewEntity Nothing
        [ PlayerMain.init M.startingPosition
        ]
    , M.drones
        |> List.map uAddDrone
        |> uList
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
