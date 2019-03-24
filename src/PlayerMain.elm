module PlayerMain exposing (init, setEntityAsPlayer)

import Assets.Tiles
import Game exposing (..)
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 exposing (vec3)
import Player exposing (ActionState(..))
import Quad
import Svgl.Primitives exposing (defaultUniforms)
import TileCollision exposing (Collision)
import Vector exposing (Vector)
import WebGL


component =
    componentNamespace "player"


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
    1 + 0.1


jumpMaxHeightWithBoost =
    2 + 0.2


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



-- States


componentState =
    component.playerActionState "state" StandIdle



-- Init


init : Vector -> Entity -> Entity
init position entity =
    { entity
        | position = position
        , size = size
    }
        |> appendThinkFunctions
            [ applyGravity

            --, applyFriction 3
            , inputMovement
            , moveCollideAndSlide
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

            --Debug.log "" ( componentState.get entity, entity.position )
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
            componentState.get entity

        newState =
            if not onFloor then
                -- If not on the floor, you are In The Air...
                InTheAir
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

        flipX =
            if env.inputHoldHorizontalMove == -1 then
                True
            else if env.inputHoldHorizontalMove == 1 then
                False
            else
                entity.flipX

        animationStart =
            if oldState /= newState then
                game.time
            else
                entity.animationStart

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
        , animationStart = animationStart
        , size = { size | height = height }
        , position = newPosition
    }
        |> componentState.set newState
        |> noDelta


isOnFloor : Game -> Entity -> Bool
isOnFloor game entity =
    -- TODO: what if the mob hits the floor at an angle, but then slides out of it?
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

        --q = Debug.log "-" (List.map (\c -> (c.tile, c.geometry)) collisions)
    in
    List.all (\collision -> collision.geometry /= Assets.Tiles.Y Assets.Tiles.Increases) collisions



-- Render


render : RenderFunction
render env game entity =
    if env.overlapsViewport size entity.position then
        [ let
            height =
                entity.size.height

            width =
                size.width * size.height / height
          in
          Quad.entity (env.entityToCamera entity.position |> Mat4.scale3 width height 1) (vec3 0 1 0)
        ]
            ++ beam env game entity
    else
        []


beam : RenderEnv -> Game -> Entity -> List WebGL.Entity
beam env game entity =
    [ straightBeam 0 entity.position (Vector.add entity.position (Vector 1 5)) env.worldToCamera
      ]


straightBeam : Float -> Vector -> Vector -> Mat4 -> WebGL.Entity
straightBeam t start end worldToCamera =
    let
        difference =
            Vector.sub end start

        { x, y } =
            Vector.add start end |> Vector.scale 0.5

        rotate =
            vectorToAngle difference

        height =
            Vector.length difference

        width =
            0.3

        --0.1 * (1 + 3 * t)
        entityToCamera =
            worldToCamera
                |> Mat4.translate3 x y 0
                |> Mat4.rotate rotate (vec3 0 0 -1)
                |> Mat4.scale3 width height 1
    in
    Svgl.Primitives.rect
        { defaultUniforms
            | fill = vec3 1 0 0
            , strokeWidth = 0
            , opacity = 0.5 --1 - Ease.outExpo t
            , entityToCamera = entityToCamera
        }
