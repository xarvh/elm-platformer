module Map exposing (..)

import Dict exposing (Dict)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import Set exposing (Set)
import TileCollision exposing (TileCollider, collideWhenXIncreases)


worldSize =
    10


tilemapSrc =
    """
 #        ^
 #   ^^    ====
###       ##   # #
############### # #
          #
"""



-- Tile Colliders


collideWhenXDecreases : TileCollider ()
collideWhenXDecreases =
    TileCollision.invertX collideWhenXIncreases


collideWhenYDecreases : TileCollider ()
collideWhenYDecreases =
    TileCollision.flipXY collideWhenXDecreases


type Delta
    = Increases
    | Decreases


type SquareBlocker
    = X Delta
    | Y Delta


platformBlocker : TileCollider SquareBlocker
platformBlocker =
    TileCollision.map (\() -> Y Decreases) collideWhenYDecreases


squareBlocker : TileCollider SquareBlocker
squareBlocker =
    TileCollision.combine
        [ TileCollision.map (\() -> Y Increases) (TileCollision.flipXY collideWhenXIncreases)
        , TileCollision.map (\() -> Y Decreases) collideWhenYDecreases
        , TileCollision.map (\() -> X Increases) collideWhenXIncreases
        , TileCollision.map (\() -> X Decreases) collideWhenXDecreases
        ]



--


charToCollider : Char -> TileCollider SquareBlocker
charToCollider char =
    case char of
        '#' ->
            squareBlocker

        '^' ->
            platformBlocker

        _ ->
            TileCollision.collideNever


type alias Tilemap =
    Dict ( Int, Int ) Char


tilemap : Tilemap
tilemap =
    tilemapSrc
        |> String.split "\n"
        |> List.indexedMap rowToTuple
        |> List.concat
        |> Dict.fromList


rowToTuple : Int -> String -> List ( ( Int, Int ), Char )
rowToTuple invertedY row =
    let
        y =
            3 - invertedY

        charToTuple index char =
            ( ( index - 8, y )
            , char
            )
    in
    row
        |> String.toList
        |> List.indexedMap charToTuple


tileAsChar : TileCollision.RowColumn -> Char
tileAsChar { column, row } =
    case Dict.get ( column, row ) tilemap of
        Nothing ->
            ' '

        Just char ->
            char


tileAsCollider : TileCollision.RowColumn -> TileCollider SquareBlocker
tileAsCollider =
    tileAsChar >> charToCollider
