module Assets.Levels.First exposing (init)

import Array exposing (Array)
import Assets.Maps.ThreeWays as M
import Assets.Tiles
import Dict exposing (Dict)
import Game exposing (..)
import Math.Matrix4 as Mat4
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import PlayerMain
import Quad
import Svgl.Tree exposing (defaultParams, ellipse, rect)
import TransformTree exposing (..)
import Vector exposing (Vector)


-- Constants


droneSpeed =
    2


droneAttackRange =
    1.2


droneReloadTime =
    2


droneSize =
    { width = 0.99
    , height = 0.99
    }



-- Components


component =
    componentNamespace "LevelsFirst"


dronePatrolA =
    component.vector "A" Vector.origin


dronePatrolB =
    component.vector "B" Vector.origin


canAttackAt =
    component.float "canAttackAt" 0



-- Init


init : Game
init =
    { new
        | mapWidth = M.width
        , mapHeight = M.height
        , mapTiles = Array.map Assets.Tiles.intToTileType M.tiles
    }
        |> createAndInitEntity (PlayerMain.init M.startingPosition)
        |> PlayerMain.setEntityAsPlayer
        |> addEnemies


addEnemies : Game -> Game
addEnemies game =
    List.foldl addDrone game M.drones


addDrone : ( Vector, Vector ) -> Game -> Game
addDrone patrolPoints game =
    Tuple.second <| createAndInitEntity (initDrone patrolPoints) game


initDrone : ( Vector, Vector ) -> Entity -> Entity
initDrone ( a, b ) entity =
    { entity
        | position = Vector.add a b |> Vector.scale 0.5
        , size = droneSize
    }
        |> dronePatrolA.set a
        |> dronePatrolB.set b
        |> appendThinkFunctions
            [ applyGravity
            , moveCollideAndSlide
            , patrol
            , zapPlayer
            ]
        |> appendRenderFunctions
            [ render
            ]



-- Thinks


patrol : ThinkFunction
patrol env game entity =
    let
        a =
            dronePatrolA.get entity

        b =
            dronePatrolB.get entity

        left =
            min a.x b.x

        right =
            max a.x b.x

        flipX =
            if entity.position.x >= right then
                True
            else if entity.position.x <= left then
                False
            else
                entity.flipX

        velocity =
            { x =
                if flipX then
                    -droneSpeed
                else
                    droneSpeed
            , y = 0
            }
    in
    noDelta { entity | flipX = flipX, velocity = velocity }


zapPlayer : ThinkFunction
zapPlayer env game droneEntity =
    if game.time < canAttackAt.get droneEntity then
        noDelta droneEntity
    else
        case Dict.get game.playerId game.entitiesById of
            Nothing ->
                noDelta droneEntity

            Just playerEntity ->
                if Vector.distance droneEntity.position playerEntity.position > droneAttackRange then
                    noDelta droneEntity
                else
                    ( canAttackAt.set (game.time + droneReloadTime) droneEntity
                    , PlayerMain.deltaZap droneEntity.position
                    )



-- Renders


render : RenderFunction
render env game entity =
    if not <| env.overlapsViewport entity.size entity.position then
        Svgl.Tree.emptyNode
    else
        [ ellipse
            { defaultParams
                | stroke = vec3 1 0.2 0
                , fill = vec3 0.7 0.1 0
            }
        , rect
            { defaultParams
                | stroke = vec3 1 0.2 0
                , fill = vec3 0.1 0.1 0.1
                , w = 0.6
                , h = 0.3
                , y = 0.2
            }
        , let
            charge =
                1 - (canAttackAt.get entity - game.time) / droneReloadTime

            n =
                3 * charge |> min 3 |> floor
          in
          List.range 0 (n - 1)
            |> List.map (renderLed game entity)
            |> Nest [ translate2 -0.2 0.2 ]
        , List.range 0 5
            |> List.map (renderLeg game entity)
            |> Nest [ translate2 0 -0.4 ]
        , List.range 0 1
            |> List.map (renderSatellites game entity)
            |> Nest []
        ]
            |> Nest [ translate entity.position ]


renderSatellites game entity index =
    let
        a =
            periodHarmonic game.time (toFloat index * pi / 2) 1
    in
    Nest
        [ rotateDeg (a * 130)
        , translate2 0 0.7
        ]
        [ ellipse
            { defaultParams
                | fill = vec3 1 0.5 0.5
                , stroke = vec3 1 0 0
                , w = 0.3
                , h = 0.15
            }
        ]


renderLed game entity index =
    let
        n =
            toFloat index
    in
    ellipse
        { defaultParams
            | fill = vec3 1 0.5 0.5
            , stroke = vec3 1 0 0
            , w = 0.18
            , h = 0.22
            , x = 0.2 * n
            , y = 0.03 * periodHarmonic game.time (pi / 1.3 * n) 1
        }


renderLeg game entity index =
    let
        xPhase =
            toFloat index * pi / 5

        x =
            periodHarmonic game.time xPhase 2

        y =
            periodHarmonic game.time (xPhase + pi / 2) 1
    in
    rect
        { defaultParams
            | fill = vec3 0.7 0.1 0
            , stroke = vec3 1 0.2 0
            , w = 0.15
            , h = 0.4
            , x = 0.4 * x
            , y =
                if y > 0 then
                    0.2 * y
                else
                    0
        }
