module Circle exposing (..)

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Math.Vector4 as Vec4 exposing (Vec4, vec4)
import WebGL exposing (Entity, Mesh, Shader)


-- Entity


entity : Mat4 -> Vec3 -> Entity
entity entityToCamera color =
    WebGL.entity
        vertexShader
        pixelShader
        mesh
        { entityToCamera = entityToCamera
        , color = color
        }



-- Types


type alias VertexAttributes =
    { x : Float
    , y : Float
    }


type alias Uniforms =
    { entityToCamera : Mat4
    , color : Vec3
    }


type alias Varyings =
    { position : Vec2
    }



-- Mesh


mesh : WebGL.Mesh VertexAttributes
mesh =
    WebGL.triangles
        [ ( { x = -1, y = -1 }
          , { x = -1, y = 1 }
          , { x = 1, y = 1 }
          )
        , ( { x = -1, y = -1 }
          , { x = 1, y = -1 }
          , { x = 1, y = 1 }
          )
        ]



-- Shaders


vertexShader : WebGL.Shader VertexAttributes Uniforms Varyings
vertexShader =
    [glsl|
        precision mediump float;

        attribute float x;
        attribute float y;

        uniform mat4 entityToCamera;
        uniform vec3 color;

        varying vec2 position;

        float s = 0.5 * 0.2;

        void main () {
            position = vec2(x, y);
            gl_Position = entityToCamera * vec4(x * s, y * s, 0, 1);
        }
    |]


pixelShader : WebGL.Shader {} Uniforms Varyings
pixelShader =
    [glsl|
        precision mediump float;

        uniform mat4 entityToCamera;
        uniform vec3 color;

        varying vec2 position;

        void main () {
          float alpha = 1.0 - step(1.0, length(position));
          gl_FragColor = alpha * vec4(color, 1.0);
        }

    |]
