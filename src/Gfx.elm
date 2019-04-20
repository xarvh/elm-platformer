module Gfx exposing (..)

-- import List.Extra

import Game exposing (..)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 exposing (vec3)
import Svgl.Tree exposing (TreeNode, defaultParams, rect)
import Vector exposing (Vector)
import WebGL


straightBeam : Float -> Vector -> Vector -> TreeNode
straightBeam t start end =
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
    in
    rect
        { defaultParams
            | fill = vec3 1 0 0
            , strokeWidth = 0
            , opacity = 0.5 --1 - Ease.outExpo t
            , x = x
            , y = y
            , rotate = rotate
            , w = width
            , h = height
        }
