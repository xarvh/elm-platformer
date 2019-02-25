module Obstacle exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import WebGL exposing (Entity, Mesh, Shader)


-- Entity


entity : Mat4 -> Entity
entity entityToCamera =
    WebGL.entity
        vertexShader
        pixelShader
        mesh
        { entityToCamera = entityToCamera }



-- Types


type alias VertexAttributes =
    { x : Float
    , y : Float
    , opacity : Float
    }


type alias Uniforms =
    { entityToCamera : Mat4
    }


type alias Varyings =
    { color : Vec4
    }



-- Mesh


mesh : WebGL.Mesh VertexAttributes
mesh =
    WebGL.triangles
        [ ( { x = -0.5
            , y = 0.5
            , opacity = 1
            }
          , { x = 0.5
            , y = 0.5
            , opacity = 1
            }
          , { x = 0
            , y = 0
            , opacity = 0
            }
          )
        ]



-- Shaders


vertexShader : WebGL.Shader VertexAttributes Uniforms Varyings
vertexShader =
    [glsl|
        precision mediump float;

        attribute float x;
        attribute float y;
        attribute float opacity;

        uniform mat4 entityToCamera;

        varying vec4 color;

        void main () {
            color = vec4(0, 0, 0, opacity);
            gl_Position = entityToCamera * vec4(x, y, 0, 1);
        }
    |]


pixelShader : WebGL.Shader {} Uniforms Varyings
pixelShader =
    [glsl|
        precision mediump float;

        uniform mat4 entityToCamera;
        varying vec4 color;

        void main () {
          gl_FragColor = color;
        }

    |]
