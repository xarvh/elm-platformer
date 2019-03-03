module TransformTree exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)


type Transform
    = Translate Vec3
    | Rotate Float


type Node content
    = Leaf content
    | Nest (List Transform) (List (Node content))



-- Resolution


applyTransform : Transform -> Mat4 -> Mat4
applyTransform t mat =
    case t of
        Translate v ->
            Mat4.translate v mat

        Rotate radians ->
            Mat4.rotate radians (vec3 0 0 -1) mat


resolveAndAppend : (Mat4 -> content -> output) -> Mat4 -> Node content -> List output -> List output
resolveAndAppend makeOutput transformSoFar node entitiesSoFar =
    case node of
        Leaf a ->
            makeOutput transformSoFar a :: entitiesSoFar

        Nest transforms children ->
            let
                newTransform =
                    List.foldl applyTransform transformSoFar transforms
            in
            List.foldr (resolveAndAppend makeOutput newTransform) entitiesSoFar children



-- Helpers


translate : Vec2 -> Transform
translate v =
    Translate (vec3 (Vec2.getX v) (Vec2.getY v) 0)


translateVz : Vec2 -> Float -> Transform
translateVz v z =
    Translate (vec3 (Vec2.getX v) (Vec2.getY v) z)


translate2 : Float -> Float -> Transform
translate2 x y =
    Translate (vec3 x y 0)


rotateRad : Float -> Transform
rotateRad =
    Rotate


rotateDeg : Float -> Transform
rotateDeg =
    degrees >> rotateRad
