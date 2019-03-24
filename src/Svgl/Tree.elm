module Svgl.Tree exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Svgl.Primitives exposing (PrimitiveShape(..), defaultUniforms)
import TransformTree exposing (Node(..))
import WebGL


type Svgl
    = Svgl PrimitiveShape Params
    | PureEntity WebGL.Entity


type alias SvglNode =
    Node Svgl


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
    , fill = defaultUniforms.fill
    , stroke = defaultUniforms.stroke
    , strokeWidth = 0.025
    , opacity = 1
    }


svglLeafToWebGLEntity : Mat4 -> Svgl -> WebGL.Entity
svglLeafToWebGLEntity parentToCamera svgl =
    case svgl of
        PureEntity entity ->
            entity

        Svgl shape p ->
            Svgl.Primitives.shape
                shape
                { defaultUniforms
                    | entityToCamera =
                        parentToCamera
                            |> Mat4.translate3 p.x p.y p.z
                            |> Mat4.rotate p.rotate (vec3 0 0 -1)
                    , dimensions = vec2 p.w p.h
                    , fill = p.fill
                    , stroke = p.stroke
                    , strokeWidth = p.strokeWidth
                    , opacity = p.opacity
                }


rect : Params -> Node Svgl
rect params =
    Leaf <| Svgl Rectangle params


rightTri : Params -> Node Svgl
rightTri params =
    Leaf <| Svgl RightTriangle params


ellipse : Params -> Node Svgl
ellipse params =
    Leaf <| Svgl Ellipse params


emptyNode : Node Svgl
emptyNode =
    Nest [] []
