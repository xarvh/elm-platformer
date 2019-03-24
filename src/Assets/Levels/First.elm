module Assets.Levels.First exposing (init)

import Array exposing (Array)
import Assets.Maps.ThreeWays as M
import Assets.Tiles
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



{-
   moveAlongSurface : ThinkFunction
   moveAlongSurface env game entity =
       case maybeFloor entity of
           Nothing ->
               -- TODO add fall animation?
               noDelta entity

           Just floor ->
               let
                   rowColumn =
                      vecToRowColumn entity.position

                   columnToCheck =
                       if entity.velocity.x > 0 then
                           currentColumn + 1
                       else
                           currentColumn - 1

                   velocity =
                       entity.velocity
               in
               noDelta <|
                   if True then
                       --obstacle or no floor on columnToCheck then
                       { entity | velocity = { velocity | x = -droneSpeed * sign velocity.x } }
                   else
                       entity


   maybeFloor : Entity -> Maybe RowColumn
   maybeFloor entity =
       Nothing
-}
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
        , List.range 0 2
            |> List.map (renderLed game entity)
            |> Nest [ translate2 -0.2 0.2 ]
        , List.range 0 5
            |> List.map (renderLeg game entity)
            |> Nest [ translate2 0 -0.4 ]
        ]
            |> Nest [ translate entity.position ]


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
