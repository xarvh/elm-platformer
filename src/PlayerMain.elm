module PlayerMain exposing (deltaZap, init, setEntityAsPlayer)

import Assets.Gfx
import Assets.Tiles
import Game exposing (..)
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 exposing (Vec3, vec3)
import Player exposing (ActionState(..))
import Quad
import Svgl.Tree exposing (SvglNode, defaultParams, emptyNode)
import TileCollision exposing (Collision)
import Vector exposing (Vector)
import WebGL


component =
    componentNamespace "player"


cState =
    let
        c =
            component.playerActionState "actionState" StandIdle

        set : Game -> ActionState -> Entity -> Entity
        set game state e =
            (if state == c.get e then
                e
             else
                { e | animationStart = game.time }
            )
                |> c.set state
    in
    { get = c.get
    , set = set
    }


climbingSpeed =
    5


zapDuration =
    0.6


resizeSpeed =
    10


airHorizontalFriction =
    3


slideFriction =
    0.4


minimumSlideSpeed =
    0.1


airWalkingSpeed =
    9


jumpMaxHeightWithoutBoost =
    1 + 0.2


jumpMaxHeightWithBoost =
    2 + 0.3


runningSpeed =
    10


crawlingSpeed =
    4


size =
    { width = 0.8
    , height = 1.9
    }


jumpInitialSpeed =
    sqrt (2 * gravity * jumpMaxHeightWithoutBoost)


jumpBoostTime =
    (jumpMaxHeightWithBoost - jumpMaxHeightWithoutBoost) / jumpInitialSpeed



-- Init


init : Vector -> Entity -> Entity
init position entity =
    { entity
        | position = position
        , size = size
    }
        |> appendThinkFunctions
            [ moveCollideAndSlide
            , applyGravity
            , inputMovement
            , moveCamera
            ]
        |> appendRenderFunctions
            [ render
            ]


setEntityAsPlayer : ( Entity, Game ) -> Game
setEntityAsPlayer ( player, game ) =
    { game | playerId = player.id }



-- Think


moveCamera : ThinkFunction
moveCamera env game entity =
    if game.cameraMode /= CameraFollowsPlayer then
        noDelta entity
    else
        let
            q =
                0

            --Debug.log "" ( cState.get entity, entity.position )
        in
        ( entity
        , DeltaGame (\g -> { g | cameraPosition = entity.position })
        )


inputMovement : ThinkFunction
inputMovement env game entity =
    let
        onFloor =
            isOnFloor game entity

        inputJumpDown =
            env.inputHoldCrouch && env.inputClickJump

        doJumpDown =
            onFloor && inputJumpDown && floorAllowsJumpDown game entity

        oldState =
            cState.get entity

        canClimb =
            canReachLadder game entity

        newState =
            if oldState == Zapped && game.time - entity.animationStart < zapDuration then
                Zapped
            else if oldState == Climbing && not canClimb then
                InTheAir
            else if env.inputHoldUp && canClimb then
                Climbing
            else if not onFloor then
                if oldState /= Climbing || env.inputClickJump then
                    InTheAir
                else
                    Climbing
            else if inputJumpDown then
                if doJumpDown then
                    InTheAir
                else
                    oldState
            else if env.inputHoldCrouch && oldState == Slide && abs entity.velocity.x > crawlingSpeed then
                -- Keep sliding
                Slide
            else if env.inputHoldCrouch || not (ceilingHasSpace game entity) then
                if env.inputHoldHorizontalMove == 0 then
                    CrouchIdle
                else if oldState == Run then
                    Slide
                else
                    Crawl
            else if env.inputClickJump then
                InTheAir
            else if env.inputHoldHorizontalMove /= 0 then
                Run
            else
                StandIdle

        oldVelocity =
            entity.velocity

        newVelocity =
            case newState of
                InTheAir ->
                    { x =
                        if env.inputHoldHorizontalMove == 0 then
                            oldVelocity.x * (1 - airHorizontalFriction * env.dt)
                        else
                            toFloat env.inputHoldHorizontalMove * airWalkingSpeed
                    , y =
                        if env.inputClickJump && (oldState == StandIdle || oldState == Run) then
                            jumpInitialSpeed
                        else if env.inputHoldJump && oldState == InTheAir && oldVelocity.y > 0 && game.time - entity.animationStart < jumpBoostTime then
                            jumpInitialSpeed
                        else
                            oldVelocity.y
                    }

                StandIdle ->
                    -- TODO apply A LOT of friction instead?
                    { oldVelocity | x = 0 }

                CrouchIdle ->
                    { oldVelocity | x = 0 }

                Run ->
                    { oldVelocity | x = toFloat env.inputHoldHorizontalMove * runningSpeed }

                Crawl ->
                    { oldVelocity | x = toFloat env.inputHoldHorizontalMove * crawlingSpeed }

                Slide ->
                    { oldVelocity | x = oldVelocity.x * (1 - slideFriction * env.dt) }

                Zapped ->
                    { oldVelocity | x = oldVelocity.x * (1 - airHorizontalFriction * env.dt) }

                Climbing ->
                    { x = toFloat env.inputHoldHorizontalMove
                    , y =
                        if env.inputHoldUp then
                            1
                        else if env.inputHoldCrouch then
                            -1
                        else
                            0
                    }
                        |> Vector.normalize
                        |> Vector.scale climbingSpeed

        flipX =
            if env.inputHoldHorizontalMove == -1 then
                True
            else if env.inputHoldHorizontalMove == 1 then
                False
            else
                entity.flipX

        targetHeight =
            if List.member newState [ CrouchIdle, Crawl, Slide ] then
                0.95
            else
                size.height

        height =
            if targetHeight > entity.size.height then
                entity.size.height + resizeSpeed * env.dt |> min targetHeight
            else if targetHeight < entity.size.height then
                entity.size.height - resizeSpeed * env.dt |> max targetHeight
            else
                targetHeight

        yOffsetDueToSizeChange =
            (height - entity.size.height) / 2

        yOffsetDueToJumpDown =
            if doJumpDown then
                0 - Assets.Tiles.platformThickness - 0.01
            else
                0

        oldPosition =
            entity.position

        newPosition =
            { oldPosition | y = oldPosition.y + yOffsetDueToSizeChange + yOffsetDueToJumpDown }
    in
    { entity
        | velocity = newVelocity
        , flipX = flipX
        , size = { size | height = height }
        , position = newPosition
    }
        |> cState.set game newState
        |> noDelta


isOnFloor : Game -> Entity -> Bool
isOnFloor game entity =
    -- TODO: what if the mob hits the floor at an angle, at very high speed, but then slides out of it?
    List.any (\collision -> collision.geometry == Assets.Tiles.Y Assets.Tiles.Decreases) entity.tileCollisions


floorAllowsJumpDown : Game -> Entity -> Bool
floorAllowsJumpDown game entity =
    case List.Extra.find (\collision -> collision.geometry == Assets.Tiles.Y Assets.Tiles.Decreases) entity.tileCollisions of
        Nothing ->
            False

        Just collision ->
            { row = collision.tile.row
            , column = coordinateToTile entity.position.x
            }
                |> getTileType game
                |> .jumpDown


{-| TODO currently the function does not allow to stand up if the player is inside a strut tile
Rewrite this function using just a tile sweep
-}
ceilingHasSpace : Game -> Entity -> Bool
ceilingHasSpace game entity =
    let
        startPosition =
            entity.position

        endPosition =
            { startPosition | y = startPosition.y + (size.height - entity.size.height) / 2 }

        collisions =
            TileCollision.collide
                (getTileType game >> .collider)
                { width = entity.size.width
                , height = entity.size.height
                , start = startPosition
                , end = endPosition
                }
    in
    List.all (\collision -> collision.geometry /= Assets.Tiles.Y Assets.Tiles.Increases) collisions


canReachLadder : Game -> Entity -> Bool
canReachLadder game entity =
    { start = entity.position
    , end = entity.position
    , height = entity.size.height
    , width = entity.size.width
    }
        |> TileCollision.sweep
        --|> Debug.log (Debug.toString entity.position)
        |> List.any (getTileType game >> .isLadder)


deltaIncreaseDarkness : Delta
deltaIncreaseDarkness =
    DeltaGame (\game -> { game | darknessTarget = game.darknessTarget + 0.1 |> min 1 })



-- Exposed deltas


deltaZap : Vector -> Delta
deltaZap zapOrigin =
    DeltaList
        [ deltaIncreaseDarkness
        , deltaPlayer
            (\game player ->
                { player
                    | velocity =
                        Vector.sub player.position zapOrigin
                            |> Vector.normalize
                            |> Vector.add (Vector 0 0.2)
                            |> Vector.scale 18
                }
                    |> cState.set game Zapped
            )
        ]


deltaPlayer : (Game -> Entity -> Entity) -> Delta
deltaPlayer update =
    DeltaGame (\game -> updateEntity game.playerId update game)



-- Render


flashColor : Game -> Seconds -> Vec3 -> Vec3
flashColor game finishesAt color =
    if game.time < finishesAt && periodLinear game.time finishesAt 0.2 < 0.5 then
        vec3 1 1 1
    else
        color


render : RenderFunction
render env game entity =
    if env.overlapsViewport size entity.position then
        let
            height =
                entity.size.height

            width =
                size.width * size.height / height

            state =
                cState.get entity

            flash =
                if state == Zapped then
                    flashColor game (entity.animationStart + zapDuration)
                else
                    identity
        in
        Svgl.Tree.rect
            { defaultParams
                | w = width
                , h = height
                , fill = flash <| vec3 0 0.7 0
                , stroke = flash <| vec3 0 1 0
                , x = entity.position.x
                , y = entity.position.y
                , rotate =
                    if state /= Zapped then
                        0
                    else if entity.velocity.x > 0 then
                        pi / 6
                    else
                        -pi / 6
            }
    else
        emptyNode
