module Map exposing (..)

import Array exposing (Array)
import Assets.DemoLevel exposing (height, mapAsArrayOfInts, width)
import Assets.Tiles exposing (TileType)
import Dict exposing (Dict)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import Set exposing (Set)
import TileCollision exposing (RowColumn, TileCollider, collideWhenXIncreases)


getTileAsInt : RowColumn -> Int
getTileAsInt { row, column } =
    case Array.get (column + (height - row - 1) * width) mapAsArrayOfInts of
        Just n ->
            n

        Nothing ->
            0


getTileType : RowColumn -> TileType
getTileType rowColumn =
    case getTileAsInt rowColumn of
        0 ->
            Assets.Tiles.none

        1 ->
            Assets.Tiles.transparentBlocker

        2 ->
            Assets.Tiles.rivetedBlocker

        3 ->
            Assets.Tiles.oneWayPlatform

        4 ->
            Assets.Tiles.crossedStruts

        5 ->
            Assets.Tiles.ground

        _ ->
            Assets.Tiles.none
