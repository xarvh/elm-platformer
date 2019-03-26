module TransformTree exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3
import Vector exposing (Vector)


type Transform
    = Translate { x : Float, y : Float, z : Float }
    | Rotate Float


type Node content
    = Leaf content
    | Nest (List Transform) (List (Node content))



-- Resolution


applyTransform : Transform -> Mat4 -> Mat4
applyTransform t mat =
    case t of
        Translate v ->
            Mat4.translate3 v.x v.y v.z mat

        Rotate radians ->
            Mat4.rotate radians rotationAxis mat


resolveAndAppend : (Mat4 -> content -> output) -> Mat4 -> Node content -> List output -> List output
resolveAndAppend makeOutput transformSoFar node accumulator =
    case node of
        Leaf a ->
            makeOutput transformSoFar a :: accumulator

        Nest transforms children ->
            let
                newTransform =
                    List.foldl applyTransform transformSoFar transforms
            in
            List.foldr (resolveAndAppend makeOutput newTransform) accumulator children



-- Helpers


rotationAxis : Math.Vector3.Vec3
rotationAxis =
    Math.Vector3.vec3 0 0 -1


translate : Vector -> Transform
translate v =
    Translate { x = v.x, y = v.y, z = 0 }


translateVz : Vector -> Float -> Transform
translateVz v z =
    Translate { x = v.x, y = v.y, z = z }


translate2 : Float -> Float -> Transform
translate2 x y =
    Translate { x = x, y = y, z = 0 }


rotateRad : Float -> Transform
rotateRad =
    Rotate


rotateDeg : Float -> Transform
rotateDeg =
    degrees >> rotateRad
