module Svgl.Tree exposing (..)

import Color exposing (Color, hsl, hsla)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import Svgl.Primitives exposing (PrimitiveShape(..))
import TransformTree exposing (Node(..))
import WebGL


type alias Renderable =
    ( PrimitiveShape, Params )


type alias TreeNode =
    Node Renderable


type alias Params =
    { x : Float
    , y : Float
    , z : Float
    , rotate : Float
    , w : Float
    , h : Float
    , fill : Color
    , stroke : Color
    , strokeWidth : Float
    , opacity : Float
    }


defaultParams : Params
defaultParams =
    { x = 0
    , y = 0
    , z = 0
    , rotate = 0
    , w = 1
    , h = 1
    , fill = hsl 1 1 0.5
    , stroke = hsl 1 1 0.3
    , strokeWidth = 0.025
    , opacity = 1
    }


rotationPivot : Vec3
rotationPivot =
    vec3 0 0 -1


colorToVec : Color -> Vec4
colorToVec color =
    let
        { red, green, blue, alpha } =
            Color.toRgba color
    in
    vec4 red green blue alpha


svglLeafToWebGLEntity : Svgl.Primitives.Uniforms -> Mat4 -> Renderable -> WebGL.Entity
svglLeafToWebGLEntity defaultUniforms parentToWorld ( shape, p ) =
    Svgl.Primitives.shape shape
        { defaultUniforms
            | entityToWorld =
                parentToWorld
                    |> Mat4.translate3 p.x p.y p.z
                    |> Mat4.rotate p.rotate rotationPivot
            , dimensions = vec2 p.w p.h
            , fill = colorToVec p.fill
            , stroke = colorToVec p.stroke
            , strokeWidth = p.strokeWidth
            , opacity = p.opacity
        }


rect : Params -> TreeNode
rect params =
    Leaf ( Rectangle, params )


rightTri : Params -> TreeNode
rightTri params =
    Leaf ( RightTriangle, params )


ellipse : Params -> TreeNode
ellipse params =
    Leaf ( Ellipse, params )


emptyNode : TreeNode
emptyNode =
    Nest [] []
