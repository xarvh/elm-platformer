module Game exposing (..)

import Assets.Tiles
import Dict exposing (Dict)
import Map
import Math.Matrix4 as Mat4 exposing (Mat4)
import Player
import Random
import TileCollision exposing (Collision)
import Vector exposing (Vector)
import Viewport
import WebGL


-- Basic types


type alias Seconds =
    Float


type alias Angle =
    Float


type alias Id =
    Int


type alias Size =
    Viewport.WorldSize



-- Game


type alias Game =
    { playerId : Id
    , cameraPosition : Vector
    , cameraMode : CameraMode
    , entitiesById : Dict Id Entity
    , time : Float
    , lastId : Id
    , seed : Random.Seed
    , laters : List ( Seconds, Delta )
    }


new : Game
new =
    { playerId = 0
    , cameraPosition = Vector.origin
    , cameraMode = CameraFollowsPlayer
    , entitiesById = Dict.empty
    , time = 0
    , lastId = 0
    , seed = Random.initialSeed 0
    , laters = []
    }


type CameraMode
    = CameraFollowsPlayer



-- Entity


type alias Entity =
    { id : Id
    , spawnedAt : Seconds

    --
    , position : Vector
    , speed : Vector
    , size : Size

    --
    , tileCollisions : List (Collision Assets.Tiles.SquareCollider)

    --
    , renderScripts : List RenderScript
    , thinkScripts : List ThinkScript
    }


newEntity : Game -> Entity
newEntity game =
    { id = game.lastId + 1
    , spawnedAt = game.time

    --
    , position = Vector.origin
    , speed = Vector.origin
    , size = { width = 0, height = 0 }

    --
    , tileCollisions = []

    --
    , renderScripts = []
    , thinkScripts = []
    }


{-| This is necessary to avoid a circular dependency between Entity and Game
-}
type RenderScript
    = RenderScript RenderFunction


type alias RenderFunction =
    RenderEnv -> Game -> Entity -> List WebGL.Entity


type alias RenderEnv =
    { worldToCamera : Mat4
    , visibleWorldSize : Size
    , overlapsViewport : Size -> Vector -> Bool
    }


{-| This is necessary to avoid a circular dependency between Entity and Game
-}
type ThinkScript
    = ThinkScript ThinkFunction


type alias ThinkFunction =
    ThinkEnv -> Game -> Entity -> ( Entity, Delta )


type alias ThinkEnv =
    { inputMove : Vector
    , dt : Float
    }



-- Deltas


type Delta
    = DeltaNone
    | DeltaList (List Delta)
    | DeltaLater Seconds Delta
    | DeltaGame (Game -> Game)
    | DeltaRandom (Random.Generator Delta)
    | DeltaOutcome Outcome
      -- This is a way to allow update functions to produce Deltas. Not too happy about it.
    | DeltaNeedsUpdatedGame (Game -> Delta)


type Outcome
    = OutcomeSave



-- Game helpers


noDelta : a -> ( a, Delta )
noDelta a =
    ( a, DeltaNone )


createAndInitEntity : (Entity -> Entity) -> Game -> ( Entity, Game )
createAndInitEntity initEntity game =
    let
        entity =
            game
                |> newEntity
                |> initEntity
    in
    ( entity
    , { game
        | entitiesById = Dict.insert entity.id entity game.entitiesById
        , lastId = entity.id
      }
    )


deleteEntity : Id -> Game -> Game
deleteEntity id game =
    { game | entitiesById = Dict.remove id game.entitiesById }


appendThinkFunctions : List ThinkFunction -> Entity -> Entity
appendThinkFunctions fs entity =
    { entity | thinkScripts = entity.thinkScripts ++ List.map ThinkScript fs }


appendRenderFunctions : List RenderFunction -> Entity -> Entity
appendRenderFunctions fs entity =
    { entity | renderScripts = entity.renderScripts ++ List.map RenderScript fs }



-- Time helpers


periodLinear : Seconds -> Float -> Seconds -> Float
periodLinear time phase period =
    let
        t =
            time + phase * period

        n =
            t / period |> floor |> toFloat
    in
    t / period - n


periodHarmonic : Seconds -> Angle -> Seconds -> Float
periodHarmonic time phase period =
    2 * pi * periodLinear time phase period |> sin


smooth : Float -> Float -> Float -> Float
smooth t a b =
    let
        tt =
            t

        -- Ease.inOutCubic t
    in
    tt * b + (1 - tt) * a


step : Float -> Float -> Float -> Float -> Float
step t threshold a b =
    if t > threshold then
        b
    else
        a



-- Angle helpers


vectorToAngle : Vector -> Float
vectorToAngle v =
    atan2 v.x v.y


normalizeAngle : Float -> Float
normalizeAngle angle =
    let
        n =
            (angle + pi) / (2 * pi) |> floor |> toFloat
    in
    angle - n * 2 * pi


turnTo : Float -> Float -> Float -> Float
turnTo maxTurn targetAngle currentAngle =
    (targetAngle - currentAngle)
        |> normalizeAngle
        |> clamp -maxTurn maxTurn
        |> (+) currentAngle
        |> normalizeAngle


angleToVector : Float -> Vector
angleToVector angle =
    { x = sin angle
    , y = cos angle
    }



-- TODO: Stuff that probably should not be here


applyGravity : ThinkFunction
applyGravity env game entity =
    noDelta
        { entity
            | speed =
                { x = 0
                , y = -4.0 * env.dt
                }
                    |> Vector.add entity.speed
        }


applyFriction : ThinkFunction
applyFriction env game entity =
    noDelta
        { entity
            | speed =
                entity.speed
                    |> Vector.scale (-3 * env.dt)
                    |> Vector.add entity.speed
        }


moveCollideAndSlide : ThinkFunction
moveCollideAndSlide env game entity =
    let
        idealPosition =
            entity.speed
                |> Vector.scale env.dt
                |> Vector.add entity.position

        collisions =
            TileCollision.collide
                (Map.getTileType >> .collider)
                { width = entity.size.width
                , height = entity.size.height
                , start = entity.position
                , end = idealPosition
                }

        fixedPosition =
            case collisions of
                [] ->
                    idealPosition

                collision :: cs ->
                    collision.fix
    in
    noDelta
        { entity
            | position = fixedPosition
            , speed = Assets.Tiles.fixSpeed collisions entity.speed
            , tileCollisions = collisions
        }
