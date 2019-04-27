module PlayerMain exposing (init, uZapPlayer)

-- import Baloon
import Color exposing (Color, hsl, hsla)
import Dict exposing (Dict)
import EntityMain
import Game exposing (..)
import List.Extra
import Player exposing (ActionState)
import Set exposing (Set)
import Svgl.Tree exposing (defaultParams, ellipse, emptyNode, rect)
import TileCollision exposing (Collision)
import Tiles exposing (SquareCollider)
import TransformTree exposing (..)
import Vector exposing (Vector)


component =
    componentNamespace "player"


cCanFireAt =
    component.seconds "canFireAt" 0


-- cBaloonColor =
--     Baloon.colorComponent


cState =
    let
        c =
            component.playerActionState "actionState" Player.StandIdle

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


reloadTime =
    1


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


init : Vector -> EntityUpdateFunction
init position env maybeParent game entity =
    ( { entity
        | size = size
      }
        |> setPositionsFromRelative maybeParent position
        |> appendEntityUpdateFunctions
            [ EntityMain.moveCollideAndSlide
            , EntityMain.applyGravity
            , inputMovement
            , moveCamera
            , inputUseGear

            --, debug
            ]
        |> appendRenderFunctions
            [ render
            ]
--         |> cBaloonColor.set {- TODO -} 2
    , { game | playerId = entity.id }
    , OutcomeNone
    )


debug env maybeParent game entity =
    let
        _ =
            Debug.log "" ( entity.relativePosition, entity.absolutePosition )
    in
    ( entity, game, OutcomeNone )



-- Think


moveCamera : EntityUpdateFunction
moveCamera env maybeParent game entity =
    if game.cameraMode /= CameraFollowsPlayer then
        ( entity
        , game
        , OutcomeNone
        )
    else
        ( entity
        , { game | cameraPosition = entity.absolutePosition }
        , OutcomeNone
        )


inputUseGear : EntityUpdateFunction
inputUseGear env maybeParent game entity =
    if env.inputUseGearClick && game.time >= cCanFireAt.get entity then
        toTriple
            ( entity
                |> cCanFireAt.set (game.time + reloadTime)
            , uNewEntity
                Nothing
                [ eDecayProjectile entity.absolutePosition entity.flipX
                ]
                env
                game
            )
    else
        entityOnly game entity


inputMovement : EntityUpdateFunction
inputMovement env maybeParent game entity =
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
            if oldState == Player.Zapped && game.time - entity.animationStart < zapDuration then
                Player.Zapped
            else if oldState == Player.Climbing && not canClimb then
                Player.InTheAir
            else if env.inputHoldUp && canClimb then
                Player.Climbing
            else if not onFloor then
                if oldState /= Player.Climbing || env.inputClickJump then
                    Player.InTheAir
                else
                    Player.Climbing
            else if inputJumpDown then
                if doJumpDown then
                    Player.InTheAir
                else
                    oldState
            else if env.inputHoldCrouch && oldState == Player.Slide && abs entity.relativeVelocity.x > crawlingSpeed then
                -- Keep sliding
                Player.Slide
            else if env.inputHoldCrouch || not (ceilingHasSpace game entity) then
                if env.inputHoldHorizontalMove == 0 then
                    Player.CrouchIdle
                else if oldState == Player.Run then
                    Player.Slide
                else
                    Player.Crawl
            else if env.inputClickJump then
                Player.InTheAir
            else if env.inputHoldHorizontalMove /= 0 then
                Player.Run
            else
                Player.StandIdle

        oldVelocity =
            entity.relativeVelocity

        newRelativeVelocity =
            case newState of
                Player.InTheAir ->
                    { x =
                        if env.inputHoldHorizontalMove == 0 then
                            oldVelocity.x * (1 - airHorizontalFriction * env.dt)
                        else
                            toFloat env.inputHoldHorizontalMove * airWalkingSpeed
                    , y =
                        if env.inputClickJump && (oldState == Player.StandIdle || oldState == Player.Run) then
                            jumpInitialSpeed
                        else if env.inputHoldJump && oldState == Player.InTheAir && oldVelocity.y > 0 && game.time - entity.animationStart < jumpBoostTime then
                            jumpInitialSpeed
                        else
                            oldVelocity.y
                    }

                Player.StandIdle ->
                    -- TODO apply A LOT of friction instead?
                    { oldVelocity | x = 0 }

                Player.CrouchIdle ->
                    { oldVelocity | x = 0 }

                Player.Run ->
                    { oldVelocity | x = toFloat env.inputHoldHorizontalMove * runningSpeed }

                Player.Crawl ->
                    { oldVelocity | x = toFloat env.inputHoldHorizontalMove * crawlingSpeed }

                Player.Slide ->
                    { oldVelocity | x = oldVelocity.x * (1 - slideFriction * env.dt) }

                Player.Zapped ->
                    { oldVelocity | x = oldVelocity.x * (1 - airHorizontalFriction * env.dt) }

                Player.Climbing ->
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
            if List.member newState [ Player.CrouchIdle, Player.Crawl, Player.Slide ] then
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
                0 - Tiles.platformThickness - 0.01
            else
                0

        oldPosition =
            entity.relativePosition

        newRelativePosition =
            { oldPosition | y = oldPosition.y + yOffsetDueToSizeChange + yOffsetDueToJumpDown }
    in
    ( { entity
        | flipX = flipX
        , size = { size | height = height }
      }
        |> setVelocitiesFromRelative maybeParent newRelativeVelocity
        |> setPositionsFromRelative maybeParent newRelativePosition
        |> cState.set game newState
    , game
    , OutcomeNone
    )


isOnFloor : Game -> Entity -> Bool
isOnFloor game entity =
    -- TODO: what if the mob hits the floor at an angle, at very high speed, but then slides out of it?
    List.any (\collision -> collision.geometry == Tiles.Y Tiles.Decreases) entity.tileCollisions


floorAllowsJumpDown : Game -> Entity -> Bool
floorAllowsJumpDown game entity =
    -- TODO doesn't work when player is on the edge, closer to an empty tile
    case List.Extra.find (\collision -> collision.geometry == Tiles.Y Tiles.Decreases) entity.tileCollisions of
        Nothing ->
            False

        Just collision ->
            { row = collision.tile.row
            , column = coordinateToTile entity.absolutePosition.x
            }
                |> getForegroundTile game
                |> .jumpDown


{-| TODO currently the function does not allow to stand up if the player is inside a strut tile
Rewrite this function using just a tile sweep
-}
ceilingHasSpace : Game -> Entity -> Bool
ceilingHasSpace game entity =
    let
        startPosition =
            entity.absolutePosition

        endPosition =
            { startPosition | y = startPosition.y + (size.height - entity.size.height) / 2 }

        collisions =
            TileCollision.collide
                (getForegroundTile game >> .collider)
                { width = entity.size.width
                , height = entity.size.height
                , start = startPosition
                , end = endPosition
                }
    in
    List.all (\collision -> collision.geometry /= Tiles.Y Tiles.Increases) collisions


canReachLadder : Game -> Entity -> Bool
canReachLadder game entity =
    { start = entity.absolutePosition
    , end = entity.absolutePosition
    , height = entity.size.height
    , width = entity.size.width
    }
        |> TileCollision.sweep
        |> List.any (getForegroundTile game >> .isLadder)


uIncreaseDarkness : UpdateFunction
uIncreaseDarkness env game =
    noOut { game | darknessTarget = game.darknessTarget + 0.1 |> min 1 }



-- Exposed deltas


uZapPlayer : Vector -> UpdateFunction
uZapPlayer zapOrigin =
    uList
        [ uIncreaseDarkness
        , uPlayer
            [ \env maybeParent game player ->
                player
                    |> cState.set game Player.Zapped
                    |> setVelocitiesFromRelative maybeParent
                        (Vector.sub player.absolutePosition zapOrigin
                            |> Vector.normalize
                            |> Vector.add (Vector 0 0.2)
                            |> Vector.scale 18
                        )
                    |> entityOnly game
            ]
        ]


uPlayer : List EntityUpdateFunction -> UpdateFunction
uPlayer fs env game =
    uEntity game.playerId fs env game



-- Render


flashColor : Game -> Seconds -> Color -> Color
flashColor game finishesAt color =
    if game.time < finishesAt && periodLinear game.time finishesAt 0.2 < 0.5 then
        Color.white
    else
        color


render : RenderFunction
render env game entity =
    if env.overlapsViewport size entity.absolutePosition then
        let
            height =
                entity.size.height

            width =
                size.width * size.height / height

            state =
                cState.get entity

            flash =
                if state == Player.Zapped then
                    flashColor game (entity.animationStart + zapDuration)
                else
                    identity
        in
        Svgl.Tree.rect
            { defaultParams
                | w = width
                , h = height
                , fill = flash <| Color.rgb 0 0.7 0
                , stroke = flash <| Color.rgb 0 1 0
                , x = entity.absolutePosition.x
                , y = entity.absolutePosition.y
                , rotate =
                    if state /= Player.Zapped then
                        0
                    else if entity.relativeVelocity.x > 0 then
                        pi / 6
                    else
                        -pi / 6
            }
            |> RenderableTree
    else
        RenderableNone



-- Projectile


eDecayProjectile : Vector -> Bool -> EntityUpdateFunction
eDecayProjectile position flipX env maybeParent game entity =
    let
        xSign =
            if flipX then
                -1
            else
                1
    in
    { entity
        | tags = Set.singleton "decay projectile"
    }
        |> setPositionsFromAbsolute maybeParent position
        |> setVelocitiesFromAbsolute maybeParent (Vector (5 * xSign) 0)
        |> appendEntityUpdateFunctions
            [ EntityMain.moveCollide removeOnTileCollision
            ]
        |> appendRenderFunctions
            [ renderProjectile
            ]
        |> entityOnly game


removeOnTileCollision : Collision SquareCollider -> EntityUpdateFunction
removeOnTileCollision collision env maybeParent game entity =
    -- TODO remove self (this should probably be a helper in the Game module)
    ( entity, game, OutcomeNone )


renderProjectile : RenderFunction
renderProjectile env game entity =
    if not <| env.overlapsViewport entity.size entity.absolutePosition then
        RenderableNone
    else
        [ ellipse
            { defaultParams
                | stroke = Color.rgb 1 0.2 0
                , fill = Color.rgb 0.7 0.1 0
                , w = 0.5
                , h = 0.5
            }
        ]
            |> Nest [ translate entity.absolutePosition ]
            |> RenderableTree
