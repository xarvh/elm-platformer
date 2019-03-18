module Map exposing (..)

import Array exposing (Array)
import Assets.DemoLevel exposing (height, mapAsArrayOfInts, width)
import Assets.Tiles exposing (TileType)
import TileCollision exposing (RowColumn, TileCollider, collideWhenXIncreases)
import Vector exposing (Vector)


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
