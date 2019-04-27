module EntityMain exposing (..)

import Game exposing (..)
import TileCollision exposing (Collision)
import Tiles exposing (SquareCollider)
import Vector exposing (Vector)


killAfter : Seconds -> EntityUpdateFunction
killAfter duration env maybeParent game entity =
    if game.time - entity.spawnedAt < duration then
        entityOnly game entity
    else
        uToE (uDeleteEntity entity.id) env maybeParent game entity


applyGravity : EntityUpdateFunction
applyGravity env maybeParent game entity =
    let
        absoluteVelocity =
            Vector.add
                entity.absoluteVelocity
                { x = 0
                , y = -gravity * env.dt
                }
    in
    entity
        |> setVelocitiesFromAbsolute maybeParent absoluteVelocity
        |> entityOnly game


applyFriction : Float -> EntityUpdateFunction
applyFriction friction env maybeParent game entity =
    let
        absoluteVelocity =
            entity.absoluteVelocity
                |> Vector.scale (-friction * env.dt)
                |> Vector.add entity.relativeVelocity
    in
    entity
        |> setVelocitiesFromAbsolute maybeParent absoluteVelocity
        |> entityOnly game


moveCollideAndSlide : EntityUpdateFunction
moveCollideAndSlide env maybeParent game entity =
    let
        idealAbsolutePosition =
            entity.absoluteVelocity
                |> Vector.scale env.dt
                |> Vector.add entity.absolutePosition

        collisions =
            TileCollision.collide
                (getForegroundTile game >> .collider)
                { width = entity.size.width
                , height = entity.size.height
                , start = entity.absolutePosition
                , end = idealAbsolutePosition
                }

        fixedAbsolutePosition =
            case collisions of
                [] ->
                    idealAbsolutePosition

                collision :: cs ->
                    collision.fix

        fixedAbsoluteVelocity =
            Tiles.fixSpeed collisions entity.absoluteVelocity
    in
    { entity | tileCollisions = collisions }
        |> setPositionsFromAbsolute maybeParent fixedAbsolutePosition
        |> setVelocitiesFromAbsolute maybeParent fixedAbsoluteVelocity
        |> entityOnly game


moveCollide : (Collision SquareCollider -> EntityUpdateFunction) -> EntityUpdateFunction
moveCollide onCollision env maybeParent game entity =
    let
        idealAbsolutePosition =
            entity.absoluteVelocity
                |> Vector.scale env.dt
                |> Vector.add entity.absolutePosition

        maybeCollision =
            TileCollision.collideOnce
                (getForegroundTile game >> .collider)
                { width = entity.size.width
                , height = entity.size.height
                , start = entity.absolutePosition
                , end = idealAbsolutePosition
                }
    in
    case maybeCollision of
        Nothing ->
            entity
                |> setPositionsFromAbsolute maybeParent idealAbsolutePosition
                |> entityOnly game

        Just collision ->
            entity
                |> setPositionsFromAbsolute maybeParent collision.aabbPositionAtImpact
                |> onCollision collision env maybeParent game
