module Game exposing (..)

{-
   NOTE

   Functions ending in `__` are supposed to be private, don't use them outside this module.
-}

import Array exposing (Array)
import Components
import Dict exposing (Dict)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Player
import Random
import Set exposing (Set)
import Svg exposing (Svg)
import Svgl.Tree
import TileCollision exposing (Collision)
import Tiles exposing (BackgroundTile, ForegroundTile, SquareCollider)
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



-- Game ----------------------------------------------------------------------


type alias Game =
    { playerId : Id
    , entitiesById : Dict Id Entity
    , rootEntitiesIds : List Id
    , lastId : Id

    -- Camera
    , cameraPosition : Vector
    , cameraMode : CameraMode

    -- Map
    , mapWidth : Int
    , mapHeight : Int
    , mapForegroundTiles : Array ForegroundTile
    , mapBackgroundTiles : Array BackgroundTile

    -- TODO use an animation type here
    , darknessState : Float
    , darknessTarget : Float

    -- System
    , time : Float
    , seed : Random.Seed
    , laters : List ( Seconds, WrappedUpdateFunction )
    }


new : Game
new =
    { playerId = 0
    , entitiesById = Dict.empty
    , rootEntitiesIds = []
    , lastId = 0

    --
    , cameraPosition = Vector.origin
    , cameraMode = CameraFollowsPlayer

    --
    , mapWidth = 1
    , mapHeight = 1
    , mapForegroundTiles = Array.fromList []
    , mapBackgroundTiles = Array.fromList []

    --
    , darknessState = 0
    , darknessTarget = 0

    --
    , time = 0
    , seed = Random.initialSeed 0
    , laters = []
    }


type CameraMode
    = CameraFollowsPlayer



-- Entity --------------------------------------------------------------------


type alias Entity =
    { id : Id
    , maybeParentId : Maybe Id
    , childrenIds : List Id
    , tags : Set String
    , spawnedAt : Seconds
    , relativePosition : Vector
    , absolutePosition : Vector
    , relativeVelocity : Vector
    , absoluteVelocity : Vector

    -- rotation is applied /after/ translation
    , angleToParent : Angle

    --
    , size : Size

    --
    , renderScripts : List RenderScript
    , wrappedUpdateFunctions : List WrappedEntityUpdateFunction
    , components : Dict String Components.Component

    --
    , tileCollisions : List (Collision SquareCollider)
    , animationStart : Seconds
    , flipX : Bool
    }


newEntity__ : Maybe Id -> Game -> Entity
newEntity__ maybeParentId game =
    { id = game.lastId + 1
    , maybeParentId = maybeParentId
    , childrenIds = []
    , tags = Set.empty

    -- rename to createdAt
    , spawnedAt = game.time

    --
    , relativePosition = Vector.origin
    , absolutePosition = Vector.origin
    , relativeVelocity = Vector.origin
    , absoluteVelocity = Vector.origin
    , angleToParent = 0

    --
    , size = { width = 0, height = 0 }

    --
    , renderScripts = []
    , wrappedUpdateFunctions = []
    , components = Dict.empty

    --
    , tileCollisions = []
    , animationStart = game.time
    , flipX = False
    }


{-| This helps distinguishing a parent entity from the child entity in
function arguments
-}
type Parent
    = Parent Entity



-- Render Functions ----------------------------------------------------------


{-| This is necessary to avoid a circular dependency between Entity and Game
-}
type RenderScript
    = RenderScript RenderFunction


type Renderable
    = RenderableNone
    | RenderableTree Svgl.Tree.TreeNode
    | RenderableSvg Int (Svg Never)
    | RenderableWebGL (List WebGL.Entity)


type alias RenderFunction =
    -- Only one type of renderable per render function
    RenderEnv -> Game -> Entity -> Renderable


type alias RenderEnv =
    { worldToCamera : Mat4
    , visibleWorldSize : Size
    , overlapsViewport : Size -> Vector -> Bool
    }



-- Update Functions ----------------------------------------------------------


{-| This is necessary to avoid a circular dependency between Entity and Game
-}
type WrappedUpdateFunction
    = WrapFunction UpdateFunction


{-| By convention, they start with `u`
-}
type alias UpdateFunction =
    UpdateEnv -> Game -> ( Game, Outcome )


type Outcome
    = OutcomeNone
    | OutcomeList (List Outcome)
    | OutcomeLog String
    | OutcomeCrash String
    | OutcomeQueryWidth Id


type WrappedEntityUpdateFunction
    = WrapEntityFunction EntityUpdateFunction


{-| By convention, they start with `e`
-}
type alias EntityUpdateFunction =
    UpdateEnv -> Maybe Parent -> Game -> Entity -> ( Entity, Game, Outcome )


type alias UpdateEnv =
    { inputHoldHorizontalMove : Int
    , inputHoldUp : Bool
    , inputHoldCrouch : Bool
    , inputHoldJump : Bool
    , inputClickJump : Bool
    , inputUseGearClick : Bool
    , dt : Float
    }


updateEnvNeutral : UpdateEnv
updateEnvNeutral =
    { inputHoldHorizontalMove = 0
    , inputHoldUp = False
    , inputHoldCrouch = False
    , inputHoldJump = False
    , inputClickJump = False
    , inputUseGearClick = False
    , dt = 0.01
    }


noOut : a -> ( a, Outcome )
noOut a =
    ( a, OutcomeNone )


{-| This helps when calling an UpdateFunction functions from within an EntityUpdateFunction
-}
toTriple : ( Entity, ( Game, Outcome ) ) -> ( Entity, Game, Outcome )
toTriple ( e, ( g, o ) ) =
    ( e, g, o )


uList : List UpdateFunction -> UpdateFunction
uList fs env game =
    let
        fold f ( w, os ) =
            f env w |> Tuple.mapSecond (\o -> o :: os)
    in
    List.foldl fold ( game, [] ) fs |> Tuple.mapSecond OutcomeList


uLater : Seconds -> UpdateFunction -> UpdateFunction
uLater delay f env game =
    noOut { game | laters = ( game.time + delay, WrapFunction f ) :: game.laters }


uRandom : Random.Generator UpdateFunction -> UpdateFunction
uRandom generator env game =
    let
        ( f, seed ) =
            Random.step generator game.seed
    in
    f env { game | seed = seed }


uEntity : Id -> List EntityUpdateFunction -> UpdateFunction
uEntity id fs env game =
    if fs == [] then
        noOut game
    else
        case Dict.get id game.entitiesById of
            Nothing ->
                noOut game

            Just entity ->
                let
                    maybeParent =
                        getParent game entity

                    ( ee, ww, oo ) =
                        List.foldl (entityUpdate_runOneFunction env maybeParent) ( entity, game, [] ) fs
                in
                ( { ww | entitiesById = Dict.insert id ee ww.entitiesById }, OutcomeList oo )


uNewEntity : Maybe Id -> List EntityUpdateFunction -> UpdateFunction
uNewEntity maybeParentId fs env oldGame =
    let
        e =
            newEntity__ maybeParentId oldGame

        maybeParent =
            getParent oldGame e

        ( entity, newGame, outcomes ) =
            List.foldl
                (entityUpdate_runOneFunction env maybeParent)
                ( setPositionsFromRelative maybeParent Vector.origin e
                , { oldGame | lastId = e.id }
                , []
                )
                fs

        updateParent =
            case maybeParentId of
                Nothing ->
                    identity

                Just parentId ->
                    -- TODO creation should fail if parent does not exist!
                    Dict.update parentId (Maybe.map (\p -> { p | childrenIds = entity.id :: p.childrenIds }))

        rootEntitiesIds =
            case maybeParentId of
                Nothing ->
                    entity.id :: newGame.rootEntitiesIds

                Just _ ->
                    newGame.rootEntitiesIds

        entitiesById =
            newGame.entitiesById
                |> Dict.insert entity.id entity
                |> updateParent
    in
    ( { newGame
        | entitiesById = entitiesById
        , rootEntitiesIds = rootEntitiesIds
        , lastId = entity.id
      }
    , OutcomeList outcomes
    )


entityUpdate_runOneFunction : UpdateEnv -> Maybe Parent -> EntityUpdateFunction -> ( Entity, Game, List Outcome ) -> ( Entity, Game, List Outcome )
entityUpdate_runOneFunction env maybeParent f ( entity, game, os ) =
    let
        ( e, w, o ) =
            f env maybeParent game entity
    in
    ( e, w, o :: os )


uDeleteEntity : Id -> UpdateFunction
uDeleteEntity id env game =
    case Dict.get id game.entitiesById of
        Nothing ->
            noOut game

        Just entity ->
            let
                removeId =
                    List.filter (\i -> i /= id)

                removeFromParent =
                    case getParent game entity of
                        Nothing ->
                            \g -> { g | rootEntitiesIds = removeId g.rootEntitiesIds }

                        Just (Parent parent) ->
                            \g -> { g | entitiesById = Dict.insert parent.id { parent | childrenIds = removeId parent.childrenIds } g.entitiesById }

                removeEntity e entitiesById =
                    entity.childrenIds
                        |> List.filterMap (\i -> Dict.get i entitiesById)
                        |> List.foldl removeEntity (Dict.remove e.id entitiesById)
            in
            { game | entitiesById = removeEntity entity game.entitiesById }
                |> removeFromParent
                |> noOut


{-| TODO rename to appendUpdateFunction
-}
appendEntityUpdateFunctions : List EntityUpdateFunction -> Entity -> Entity
appendEntityUpdateFunctions fs entity =
    { entity | wrappedUpdateFunctions = entity.wrappedUpdateFunctions ++ List.map WrapEntityFunction fs }


appendRenderFunctions : List RenderFunction -> Entity -> Entity
appendRenderFunctions fs entity =
    { entity | renderScripts = entity.renderScripts ++ List.map RenderScript fs }


getEntitiesByTag : String -> Game -> List Entity
getEntitiesByTag tag game =
    -- TODO rewirte with Dict.foldr to improve performance?
    game.entitiesById
        |> Dict.values
        |> List.filter (\e -> Set.member tag e.tags)


entityOnly : Game -> Entity -> ( Entity, Game, Outcome )
entityOnly game entity =
    ( entity, game, OutcomeNone )


eList : List EntityUpdateFunction -> EntityUpdateFunction
eList fs env maybeParent game entity =
    let
        fold f ( e, g, os ) =
            f env maybeParent g e
                |> mapThird (\o -> o :: os)
    in
    List.foldl fold ( entity, game, [] ) fs
        |> mapThird OutcomeList


uToE : UpdateFunction -> EntityUpdateFunction
uToE f env maybeParent game entity =
    toTriple
        ( entity
        , f env game
        )


mapThird : (c -> d) -> ( a, b, c ) -> ( a, b, d )
mapThird f ( a, b, c ) =
    ( a, b, f c )



-- Relatives & Absolutes


getParent : Game -> Entity -> Maybe Parent
getParent game entity =
    entity.maybeParentId
        |> Maybe.andThen (\id -> Dict.get id game.entitiesById)
        |> Maybe.map Parent


setPositionsFromRelative : Maybe Parent -> Vector -> Entity -> Entity
setPositionsFromRelative maybeParent relativePosition entity =
    case maybeParent of
        Nothing ->
            { entity
                | absolutePosition = relativePosition
                , relativePosition = relativePosition
            }

        Just (Parent parent) ->
            { entity
                | absolutePosition = Vector.add relativePosition parent.absolutePosition
                , relativePosition = relativePosition
            }


setPositionsFromAbsolute : Maybe Parent -> Vector -> Entity -> Entity
setPositionsFromAbsolute maybeParent absolutePosition entity =
    case maybeParent of
        Nothing ->
            { entity
                | absolutePosition = absolutePosition
                , relativePosition = absolutePosition
            }

        Just (Parent parent) ->
            { entity
                | absolutePosition = absolutePosition
                , relativePosition = Vector.sub absolutePosition parent.absolutePosition
            }


setVelocitiesFromRelative : Maybe Parent -> Vector -> Entity -> Entity
setVelocitiesFromRelative maybeParent relativeVelocity entity =
    case maybeParent of
        Nothing ->
            { entity
                | absoluteVelocity = relativeVelocity
                , relativeVelocity = relativeVelocity
            }

        Just (Parent parent) ->
            { entity
                | absoluteVelocity = Vector.add relativeVelocity parent.absoluteVelocity
                , relativeVelocity = relativeVelocity
            }


setVelocitiesFromAbsolute : Maybe Parent -> Vector -> Entity -> Entity
setVelocitiesFromAbsolute maybeParent absoluteVelocity entity =
    case maybeParent of
        Nothing ->
            { entity
                | absoluteVelocity = absoluteVelocity
                , relativeVelocity = absoluteVelocity
            }

        Just (Parent parent) ->
            { entity
                | absoluteVelocity = absoluteVelocity
                , relativeVelocity = Vector.sub absoluteVelocity parent.absoluteVelocity
            }



-- Map helpers


getForegroundTile : Game -> RowColumn -> ForegroundTile
getForegroundTile game { row, column } =
    case Array.get (column + (game.mapHeight - row - 1) * game.mapWidth) game.mapForegroundTiles of
        Just tile ->
            tile

        Nothing ->
            Tiles.foregroundNone


getBackgroundTile : Game -> RowColumn -> BackgroundTile
getBackgroundTile game { row, column } =
    case Array.get (column + (game.mapHeight - row - 1) * game.mapWidth) game.mapBackgroundTiles of
        Just tile ->
            tile

        Nothing ->
            Tiles.backgroundNone



-- Animation helpers


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
