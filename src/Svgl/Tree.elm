module Svgl.Tree exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Svgl.Primitives as Primitives exposing (defaultUniforms)
import WebGL exposing (Mesh, Shader)


type alias Transform =
    -- TODO: turn into `type Transform = Translate Vec3 | Rotate Float`?
    { translate : Vec3
    , rotate : Float
    }


type alias MatToEntity =
    Mat4 -> WebGL.Entity


type Node
    = Ent MatToEntity
    | Nod (List Transform) (List Node)


applyTransform : Transform -> Mat4 -> Mat4
applyTransform t mat =
    mat
        |> Mat4.translate t.translate
        |> Mat4.rotate t.rotate (vec3 0 0 -1)


appendTreeToEntities : Mat4 -> Node -> List WebGL.Entity -> List WebGL.Entity
appendTreeToEntities transformSoFar node entitiesSoFar =
    case node of
        Ent matToEntity ->
            matToEntity transformSoFar :: entitiesSoFar

        Nod transforms children ->
            let
                newTransform =
                    List.foldl applyTransform transformSoFar transforms
            in
            List.foldr (\child enli -> appendTreeToEntities newTransform child enli) entitiesSoFar children


translate : Vec2 -> Transform
translate v =
    { translate = vec3 (Vec2.getX v) (Vec2.getY v) 0
    , rotate = 0
    }


translateVz : Vec2 -> Float -> Transform
translateVz v z =
    { translate = vec3 (Vec2.getX v) (Vec2.getY v) z
    , rotate = 0
    }


translate2 : Float -> Float -> Transform
translate2 x y =
    { translate = vec3 x y 0
    , rotate = 0
    }


rotateRad : Float -> Transform
rotateRad radians =
    { translate = vec3 0 0 0
    , rotate = radians
    }


rotateDeg : Float -> Transform
rotateDeg =
    degrees >> rotateRad


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
    , fill = Primitives.defaultUniforms.fill
    , stroke = Primitives.defaultUniforms.stroke
    , strokeWidth = 0.025
    , opacity = 1
    }


entity : (Primitives.Uniforms -> WebGL.Entity) -> Params -> Node
entity primitive p =
    Nod
        [ { translate = vec3 p.x p.y 0 --p.z
          , rotate = p.rotate
          }
        ]
        [ Ent
            (\entityToCamera ->
                primitive
                    { defaultUniforms
                        | entityToCamera = entityToCamera
                        , dimensions = vec2 p.w p.h
                        , fill = p.fill
                        , stroke = p.stroke
                        , strokeWidth = p.strokeWidth
                        , opacity = p.opacity
                    }
            )
        ]


rect : Params -> Node
rect =
    entity Primitives.rect


rightTri : Params -> Node
rightTri =
    entity Primitives.rightTri


ellipse : Params -> Node
ellipse =
    entity Primitives.ellipse
