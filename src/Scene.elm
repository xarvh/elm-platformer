module Scene exposing (..)

import Assets.DemoLevel
import Assets.Tiles
import Circle
import Dict exposing (Dict)
import Game exposing (..)
import List.Extra
import Map
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import Obstacle
import Quad
import Set exposing (Set)
import Svgl.Primitives exposing (defaultUniforms, rect)
import Svgl.Tree exposing (..)
import TileCollision exposing (RowColumn)
import WebGL exposing (Entity, Mesh, Shader)


-- Periodic functions


periodLinear : Float -> Float -> Float -> Float
periodLinear time phase period =
    let
        t =
            time + phase * period

        n =
            t / period |> floor |> toFloat
    in
    t / period - n


periodHarmonic : Float -> Float -> Float -> Float
periodHarmonic time phase period =
    2 * pi * periodLinear time phase period |> sin



-- Hack, delete me


allRowColumns : List RowColumn
allRowColumns =
    let
        listToRowColumn l =
            case l of
                [ column, row ] ->
                    { column = column, row = row }

                _ ->
                    Debug.todo "blerch"
    in
    List.Extra.cartesianProduct
        [ List.range 0 (Assets.DemoLevel.width - 1)
        , List.range 0 (Assets.DemoLevel.height - 1)
        ]
        |> List.map listToRowColumn



-- Entities


type alias EntitiesArgs =
    { cameraToViewport : Mat4
    , collisions : List (TileCollision.Collision Assets.Tiles.SquareCollider)
    , time : Float
    , player : Game.Player
    }


entities : EntitiesArgs -> List Entity
entities { cameraToViewport, time, player, collisions } =
    let
        worldToViewport =
            cameraToViewport
                |> Mat4.translate3 -15 -15 0

        tilesTree =
            allRowColumns
                |> List.map renderTile
                |> Svgl.Tree.Nod []

        playerEntity =
            [ mob worldToViewport player.position (vec3 0 1 0)
            ]

        collisionEntities =
            List.indexedMap (viewCollision worldToViewport) collisions
                |> List.concat
    in
    List.concat
        [ Svgl.Tree.appendTreeToEntities worldToViewport tilesTree []
        , playerEntity
        , collisionEntities
        ]


mob : Mat4 -> Vec2 -> Vec3 -> Entity
mob worldToViewport position color =
    let
        { x, y } =
            Vec2.toRecord position

        entityToViewport =
            worldToViewport
                |> Mat4.translate3 x y 0
                |> Mat4.scale3 Game.playerSize.width Game.playerSize.height 1
    in
    Quad.entity entityToViewport color


dot : Mat4 -> Vec2 -> Float -> Vec3 -> Entity
dot worldToViewport position size color =
    let
        { x, y } =
            Vec2.toRecord position

        entityToViewport =
            worldToViewport
                |> Mat4.translate3 x y 0
                |> Mat4.scale3 size size 1
    in
    Circle.entity entityToViewport color


viewCollision : Mat4 -> Int -> TileCollision.Collision Assets.Tiles.SquareCollider -> List Entity
viewCollision worldToViewport index collision =
    let
        color =
            case index of
                0 ->
                    vec3 1 0 0

                1 ->
                    vec3 0 1 0

                _ ->
                    vec3 0 0 1
    in
    [ dot worldToViewport (vec2 (toFloat collision.tile.column) (toFloat collision.tile.row)) 1.3 color
    , dot worldToViewport (Vec2.fromRecord collision.aabbPositionAtImpact) 1 color
    ]


renderTile : RowColumn -> Node
renderTile rowColumn =
    Nod
        [ translate2 (toFloat rowColumn.column) (toFloat rowColumn.row)
        ]
        [ (Map.getTileType rowColumn).render
        ]
