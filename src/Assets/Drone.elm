module Assets.Drone exposing (init)

import Dict exposing (Dict)
import EntityMain
import Game exposing (..)
import Math.Vector3 as Vec3 exposing (vec3)
import PlayerMain
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
    componentNamespace "drone"


dronePatrolA =
    component.vector "A" Vector.origin


dronePatrolB =
    component.vector "B" Vector.origin


canAttackAt =
    component.float "canAttackAt" 0



--


init : ( Vector, Vector ) -> UpdateEntityFunction
init ( a, b ) env maybeParent game entity =
    { entity
        | size = droneSize
    }
        |> setPositionsFromRelative maybeParent (Vector.add a b |> Vector.scale 0.5)
        |> dronePatrolA.set a
        |> dronePatrolB.set b
        |> appendThinkFunctions
            [ EntityMain.applyGravity
            , EntityMain.moveCollideAndSlide
            , patrol
            , zapPlayer
            , zapProjectile
            ]
        |> appendRenderFunctions
            [ render
            ]
        |> entityOnly game



-- Thinks


patrol : UpdateEntityFunction
patrol env maybeParent game entity =
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
            if entity.relativePosition.x >= right then
                True
            else if entity.relativePosition.x <= left then
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
    ( { entity | flipX = flipX }
        |> setVelocitiesFromRelative maybeParent velocity
    , game
    , OutcomeNone
    )


zapPlayer : UpdateEntityFunction
zapPlayer env maybeParent game drone =
    if game.time < canAttackAt.get drone then
        entityOnly game drone
    else
        case Dict.get game.playerId game.entitiesById of
            Nothing ->
                entityOnly game drone

            Just playerEntity ->
                if Vector.distance drone.absolutePosition playerEntity.absolutePosition > droneAttackRange then
                    entityOnly game drone
                else
                    toTriple
                        ( drone
                            |> canAttackAt.set (game.time + droneReloadTime)
                        , PlayerMain.uZapPlayer drone.absolutePosition env game
                        )


zapProjectile : UpdateEntityFunction
zapProjectile env maybeParent game drone =
    let
        rr =
            droneAttackRange * droneAttackRange

        projectiles =
            game
                |> getEntitiesByTag "decay projectile"
                |> List.filter (\p -> Vector.distanceSquared drone.absolutePosition p.absolutePosition <= rr)
    in
    if projectiles == [] then
        ( drone, game, OutcomeNone )
    else
        toTriple
            ( drone
                |> canAttackAt.set (game.time + droneReloadTime)
            , uList
                (List.map (\p -> uDeleteEntity p.id) projectiles)
                env
                game
            )



-- Renders


render : RenderFunction
render env game entity =
    if not <| env.overlapsViewport entity.size entity.absolutePosition then
        RenderableNone
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
            |> Nest [ translate entity.absolutePosition ]
            |> RenderableTree


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
