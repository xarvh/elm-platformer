module PlayerMain exposing (init)

import Assets.Tiles
import Game exposing (..)
import Map
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 exposing (vec3)
import Player
import Quad
import TileCollision exposing (Collision)
import Vector exposing (Vector)


-- Init


init : Vector -> Entity -> Entity
init position entity =
    { entity
        | position = position
        , size = Player.size
    }
        |> appendThinkFunctions
            [ applyGravity
            , applyFriction
            , inputToSpeed
            , moveCollideAndSlide
            , moveCamera
            ]
        |> appendRenderFunctions
            [ render
            ]



-- Think


inputToSpeed : ThinkFunction
inputToSpeed env game entity =
    noDelta
        { entity
            | speed =
                env.inputMove
                    |> Vector.scale Player.baseAcceleration
                    |> Vector.add entity.speed
                    |> Vector.clampX Player.maxSpeed
                    |> Vector.clampY Player.maxSpeed
        }


moveCamera : ThinkFunction
moveCamera env game entity =
    if game.cameraMode /= CameraFollowsPlayer then
        noDelta entity
    else
        ( entity
        , DeltaGame (\g -> { g | cameraPosition = entity.position })
        )



-- Render


entityToCamera : RenderEnv -> Entity -> Mat4
entityToCamera env entity =
    env.worldToCamera
        |> Mat4.translate3 entity.position.x entity.position.y 0


render : RenderFunction
render env game entity =
    if env.overlapsViewport Player.size entity.position then
        [ Quad.entity (entityToCamera env entity |> Mat4.scale3 Player.size.width Player.size.height 1) (vec3 0 1 0)
        ]
    else
        []
