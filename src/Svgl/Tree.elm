module Svgl.Tree exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
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
    , fill : Vec3
    , stroke : Vec3
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
    , fill = Svgl.Primitives.defaultUniforms.fill
    , stroke = Svgl.Primitives.defaultUniforms.stroke
    , strokeWidth = 0.025
    , opacity = 1
    }


svglLeafToWebGLEntity : Svgl.Primitives.Uniforms -> Mat4 -> Renderable -> WebGL.Entity
svglLeafToWebGLEntity defaultUniforms parentToWorld ( shape, p ) =
    Svgl.Primitives.shape shape
        { defaultUniforms
            | entityToWorld =
                parentToWorld
                    |> Mat4.translate3 p.x p.y p.z
                    |> Mat4.rotate p.rotate (vec3 0 0 -1)
            , dimensions = vec2 p.w p.h
            , fill = p.fill
            , stroke = p.stroke
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
