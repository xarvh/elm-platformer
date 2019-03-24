module Game exposing (..)

import Array exposing (Array)
import Assets.Tiles
import Components
import Dict exposing (Dict)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Player
import Random
import Svgl.Tree exposing (SvglNode)
import TileCollision exposing (Collision)
import Vector exposing (Vector)
import Viewport
import WebGL


-- Re expose


componentNamespace =
    Components.componentNamespace


coordinateToTile =
    TileCollision.coordinateToTile


vecToRowColumn =
    TileCollision.vecToRowColumn



-- Constants


gravity =
    40.0



-- Basic types


type alias Seconds =
    Float


type alias Angle =
    Float


type alias Id =
    Int


type alias Size =
    Viewport.WorldSize


type alias RowColumn =
    { row : Int
    , column : Int
    }



-- Game


type alias Game =
    { playerId : Id
    , cameraPosition : Vector
    , cameraMode : CameraMode

    -- Actual game
    , entitiesById : Dict Id Entity
    , mapWidth : Int
    , mapHeight : Int
    , mapTiles : Array Assets.Tiles.TileType

    -- TODO use an animation type here
    , darknessState : Float
    , darknessTarget : Float

    -- System
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

    --
    , entitiesById = Dict.empty
    , mapWidth = 1
    , mapHeight = 1
    , mapTiles = Array.fromList []

    --
    , darknessState = 0
    , darknessTarget = 0

    --
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
    , velocity : Vector
    , size : Size
    , flipX : Bool

    --
    , renderScripts : List RenderScript
    , thinkScripts : List ThinkScript
    , components : Dict String Components.Component

    --
    , tileCollisions : List (Collision Assets.Tiles.SquareCollider)
    , animationStart : Seconds
    }


newEntity : Game -> Entity
newEntity game =
    { id = game.lastId + 1
    , spawnedAt = game.time

    --
    , position = Vector.origin
    , velocity = Vector.origin
    , size = { width = 0, height = 0 }
    , flipX = False

    --
    , renderScripts = []
    , thinkScripts = []
    , components = Dict.empty

    --
    , tileCollisions = []
    , animationStart = game.time
    }


{-| This is necessary to avoid a circular dependency between Entity and Game
-}
type RenderScript
    = RenderScript RenderFunction


type alias RenderFunction =
    RenderEnv -> Game -> Entity -> SvglNode


type alias RenderEnv =
    { worldToCamera : Mat4
    , entityToCamera : Vector -> Mat4
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
    { inputHoldHorizontalMove : Int
    , inputHoldCrouch : Bool
    , inputHoldJump : Bool
    , inputClickJump : Bool
    , inputClickUse : Bool
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



-- Delta helpers


noDelta : a -> ( a, Delta )
noDelta a =
    ( a, DeltaNone )


deltaEntity : Id -> (Game -> Entity -> Entity) -> Delta
deltaEntity entityId update =
    DeltaGame (updateEntity entityId update)


updateEntity : Id -> (Game -> Entity -> Entity) -> Game -> Game
updateEntity entityId update game =
    case Dict.get entityId game.entitiesById of
        Nothing ->
            game

        Just entity ->
            { game | entitiesById = Dict.insert entityId (update game entity) game.entitiesById }



-- Map helpers


getTileType : Game -> RowColumn -> Assets.Tiles.TileType
getTileType game { row, column } =
    case Array.get (column + (game.mapHeight - row - 1) * game.mapWidth) game.mapTiles of
        Just tileType ->
            tileType

        Nothing ->
            Assets.Tiles.none



-- Game helpers


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


sign : number -> number
sign n =
    if n < 0 then
        -1
    else if n > 0 then
        1
    else
        0



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
            | velocity =
                Vector.add
                    entity.velocity
                    { x = 0
                    , y = -gravity * env.dt
                    }
        }


applyFriction : Float -> ThinkFunction
applyFriction friction env game entity =
    noDelta
        { entity
            | velocity =
                entity.velocity
                    |> Vector.scale (-friction * env.dt)
                    |> Vector.add entity.velocity
        }


moveCollideAndSlide : ThinkFunction
moveCollideAndSlide env game entity =
    let
        idealPosition =
            entity.velocity
                |> Vector.scale env.dt
                |> Vector.add entity.position

        collisions =
            TileCollision.collide
                (getTileType game >> .collider)
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
            , velocity = Assets.Tiles.fixSpeed collisions entity.velocity
            , tileCollisions = collisions
        }
