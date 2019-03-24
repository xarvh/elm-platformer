module Scene exposing (..)

import Assets.Tiles
import Circle
import Dict exposing (Dict)
import Game exposing (..)
import GameMain
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Obstacle
import Player
import Quad
import Set exposing (Set)
import Svgl.Primitives exposing (defaultUniforms, rect)
import Svgl.Tree exposing (SvglNode, ellipse, rect)
import TileCollision exposing (RowColumn)
import TransformTree exposing (..)
import Vector exposing (Vector)
import Viewport exposing (WorldPosition, WorldSize)
import WebGL exposing (Entity, Mesh, Shader)


visibleRowColumns : Game -> WorldPosition -> WorldSize -> List RowColumn
visibleRowColumns game { x, y } { width, height } =
    let
        left =
            x - width / 2 |> floor |> max 0

        right =
            x + width / 2 |> ceiling |> min (game.mapWidth - 1)

        top =
            y + height / 2 |> ceiling |> min (game.mapHeight - 1)

        bottom =
            y - height / 2 |> floor |> max 0

        -- Hack, fix me
        listToRowColumn l =
            case l of
                [ column, row ] ->
                    { column = column, row = row }

                _ ->
                    Debug.todo "blerch"
    in
    List.Extra.cartesianProduct
        [ List.range left right
        , List.range bottom top
        ]
        |> List.map listToRowColumn



-- WebGL Entities


type alias EntitiesArgs =
    { viewportSize : Viewport.PixelSize
    , game : Game
    }


entities : EntitiesArgs -> List Entity
entities { viewportSize, game } =
    let
        -- viewport stuff
        viewport =
            { pixelSize = viewportSize
            , minimumVisibleWorldSize = { width = 20, height = 20 }
            }

        overlapsViewport =
            Viewport.overlaps viewport game.cameraPosition

        worldToCamera =
            viewport
                |> Viewport.worldToCameraTransform
                |> Mat4.translate3 -game.cameraPosition.x -game.cameraPosition.y 0

        entityToCamera position =
            worldToCamera |> Mat4.translate3 position.x position.y 0

        visibleWorldSize =
            Viewport.actualVisibleWorldSize viewport

        -- webgl entities
        tilesTree =
            visibleRowColumns game game.cameraPosition visibleWorldSize
                |> List.map (renderTile game)
                |> Nest []

        renderEnv : RenderEnv
        renderEnv =
            { worldToCamera = worldToCamera
            , entityToCamera = entityToCamera
            , visibleWorldSize = visibleWorldSize
            , overlapsViewport = overlapsViewport
            }

        entitiesTree =
            GameMain.render renderEnv game

        {-
           collisionEntities =
               game.entitiesById
                   |> Dict.values
                   |> List.concatMap .tileCollisions
                   |> List.indexedMap (viewCollision worldToCamera)
                   |> List.concat
        -}
    in
    []
        |> TransformTree.resolveAndAppend Svgl.Tree.svglLeafToWebGLEntity worldToCamera entitiesTree
        |> TransformTree.resolveAndAppend Svgl.Tree.svglLeafToWebGLEntity worldToCamera tilesTree


dot : Mat4 -> Vector -> Float -> Vec3 -> Entity
dot worldToViewport { x, y } size color =
    let
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
    [ dot worldToViewport { x = toFloat collision.tile.column, y = toFloat collision.tile.row } 1.3 color
    , dot worldToViewport collision.aabbPositionAtImpact 1 color
    ]


renderTile : Game -> RowColumn -> SvglNode
renderTile game rowColumn =
    Nest
        [ translate2 (toFloat rowColumn.column) (toFloat rowColumn.row)
        ]
        [ (getTileType game rowColumn).render
        ]
