module Scene exposing (..)

import Dict exposing (Dict)
import Game exposing (..)
import GameMain
import List.Extra
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2
import Player
import Quad
import Set exposing (Set)
import Svg exposing (Svg)
import Svg.Attributes
import Svgl.Primitives exposing (defaultUniforms, rect)
import Svgl.Tree
import TileCollision exposing (RowColumn)
import Tiles exposing (SquareCollider)
import TransformTree exposing (..)
import Vector exposing (Vector)
import Viewport exposing (WorldPosition, WorldSize)
import Viewport.Combine
import WebGL exposing (Mesh, Shader)


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



{-
   arrow : Mat4 -> Game -> Entity -> Svg msg
   arrow worldToCamera game entity =
       let
           a =
               pi / 8 * periodHarmonic game.time (toFloat entity.id) 1

           entityToCamera =
               worldToCamera
                   |> Mat4.translate3 entity.position.x entity.position.y 0
                   |> Mat4.scale3 1 -1 1
                   |> Mat4.scale3 0.1 0.1 0.1
                   |> Mat4.rotate a (vec3 0 0 -1)
       in
       Svg.text_
           [ Svg.Attributes.width "2"
           , Svg.Attributes.height "0.5"
           , Svg.Attributes.fill "blue"
           , Svg.Attributes.stroke "none"
           , Svg.Attributes.textAnchor "middle"
           , Viewport.Combine.transform entityToCamera
           ]
           [ Svg.text "hello" ]
-}
-- WebGL Entities


type alias EntitiesArgs =
    { viewportSize : Viewport.PixelSize
    , game : Game
    }


entities : EntitiesArgs -> ( List WebGL.Entity, List (Svg Never) )
entities { viewportSize, game } =
    let
        -- Viewport
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

        visibleWorldSize =
            Viewport.actualVisibleWorldSize viewport

        -- Entities
        playerPosition =
            Dict.get game.playerId game.entitiesById
                |> Maybe.map .absolutePosition
                |> Maybe.withDefault Vector.origin

        baseUniforms =
            { defaultUniforms
                | worldToCamera = worldToCamera
                , darknessIntensity = game.darknessState
                , darknessFocus = Math.Vector2.fromRecord playerPosition
            }

        renderEnv : RenderEnv
        renderEnv =
            { worldToCamera = worldToCamera
            , visibleWorldSize = visibleWorldSize
            , overlapsViewport = overlapsViewport
            }

        ( webGlEntities, svgs ) =
            GameMain.renderEntities baseUniforms renderEnv game

        -- Tiles
        leafToWebGl =
            Svgl.Tree.svglLeafToWebGLEntity baseUniforms

        tilesTree =
            visibleRowColumns game game.cameraPosition visibleWorldSize
                |> List.map (renderTile game)
                |> Nest []
    in
    ( webGlEntities
        |> TransformTree.resolveAndAppend leafToWebGl Mat4.identity tilesTree
    , svgs
    )


renderTile : Game -> RowColumn -> Svgl.Tree.TreeNode
renderTile game rowColumn =
    Nest
        [ translate2 (toFloat rowColumn.column) (toFloat rowColumn.row)
        ]
        [ (getTileType game rowColumn).render
        ]
