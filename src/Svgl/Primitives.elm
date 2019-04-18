module Svgl.Primitives
    exposing
        ( PrimitiveShape(..)
        , Uniforms
        , defaultUniforms
        , ellipse
        , rect
        , rightTri
        , shape
        )

import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import WebGL exposing (Entity, Mesh, Shader)
import WebGL.Settings exposing (Setting)
import WebGL.Settings.Blend as Blend


type PrimitiveShape
    = Rectangle
    | Ellipse
    | RightTriangle


type alias Attributes =
    { position : Vec2 }


type alias Uniforms =
    { sh : Int
    , entityToWorld : Mat4
    , worldToCamera : Mat4
    , darknessFocus : Vec2
    , darknessIntensity : Float
    , dimensions : Vec2
    , fill : Vec3
    , stroke : Vec3
    , strokeWidth : Float
    , opacity : Float
    }


defaultUniforms : Uniforms
defaultUniforms =
    { sh = 0
    , entityToWorld = Mat4.identity
    , worldToCamera = Mat4.identity
    , darknessFocus = vec2 0 0
    , darknessIntensity = 0
    , dimensions = vec2 1 1
    , fill = vec3 0.4 0.4 0.4
    , stroke = vec3 0.6 0.6 0.6
    , strokeWidth = 0.1
    , opacity = 1
    }


type alias Varying =
    { localPosition : Vec2
    , worldPosition : Vec2
    }


settings : List Setting
settings =
    -- https://limnu.com/webgl-blending-youre-probably-wrong/
    [ Blend.add Blend.one Blend.oneMinusSrcAlpha ]


rect : Uniforms -> Entity
rect =
    WebGL.entityWith settings quadVertexShader fragmentShader normalizedQuadMesh


ellipse : Uniforms -> Entity
ellipse u =
    WebGL.entityWith settings quadVertexShader fragmentShader normalizedQuadMesh { u | sh = 1 }


rightTri : Uniforms -> Entity
rightTri =
    WebGL.entityWith settings quadVertexShader fragmentShader normalizedRightTriMesh


shape : PrimitiveShape -> Uniforms -> Entity
shape primitiveType =
    case primitiveType of
        Rectangle ->
            rect

        Ellipse ->
            ellipse

        RightTriangle ->
            rightTri


normalizedQuadMesh : Mesh Attributes
normalizedQuadMesh =
    WebGL.triangles
        [ ( Attributes (vec2 -0.5 -0.5)
          , Attributes (vec2 0.5 -0.5)
          , Attributes (vec2 0.5 0.5)
          )
        , ( Attributes (vec2 -0.5 -0.5)
          , Attributes (vec2 -0.5 0.5)
          , Attributes (vec2 0.5 0.5)
          )
        ]


normalizedRightTriMesh : Mesh Attributes
normalizedRightTriMesh =
    WebGL.triangles
        [ ( Attributes (vec2 -0.5 -0.5)
          , Attributes (vec2 -0.5 0.5)
          , Attributes (vec2 0.5 -0.5)
          )
        ]


quadVertexShader : Shader Attributes Uniforms Varying
quadVertexShader =
    [glsl|
        precision mediump float;
        precision mediump int;

        attribute vec2 position;

        uniform int sh;
        uniform mat4 entityToWorld;
        uniform mat4 worldToCamera;
        uniform vec2 dimensions;
        uniform vec3 fill;
        uniform vec3 stroke;
        uniform float strokeWidth;

        varying vec2 localPosition;
        varying vec2 worldPosition;

        void main () {
            localPosition = (dimensions + strokeWidth * 2.0) * position;
            vec4 worldPosition4 = entityToWorld * vec4(localPosition, 0, 1);

            worldPosition = worldPosition4.xy;
            gl_Position = worldToCamera * worldPosition4;
        }
    |]


fragmentShader : Shader {} Uniforms Varying
fragmentShader =
    [glsl|
        precision mediump float;
        precision mediump int;

        uniform int sh;
        uniform mat4 entityToWorld;
        uniform mat4 worldToCamera;
        uniform vec2 darknessFocus;
        uniform float darknessIntensity;
        uniform vec2 dimensions;
        uniform vec3 fill;
        uniform vec3 stroke;
        uniform float strokeWidth;
        uniform float opacity;

        varying vec2 localPosition;
        varying vec2 worldPosition;

        // TODO: transform into `pixelSize`, make it a uniform
        float pixelsPerTile = 30.0;
        float e = 0.5 / pixelsPerTile;



        /*
         *     0               1                            1                     0
         *     |------|--------|----------------------------|----------|----------|
         *  -edge-e  -edge  -edge+e                      edge-e      edge      edge+e
         */
        float mirrorStep (float edge, float p) {
          return smoothstep(-edge - e, -edge + e, p) - smoothstep(edge - e, edge + e, p);
        }



        /*
         * Ellipse
         */
        float smoothEllipse(vec2 position, vec2 radii) {
          float x = position.x;
          float y = position.y;
          float w = radii.x;
          float h = radii.y;

          float xx = x * x;
          float yy = y * y;
          float ww = w * w;
          float hh = h * h;

          // We will need the assumption that we are not too far from the ellipse
          float ew = w + e;
          float eh = h + e;

          if ( xx / (ew * ew) + yy / (eh * eh) > 1.0 ) {
            return 1.0;
          }

          /*
          Given an ellipse Q with radii W and H, the ellipse P whose every point
          has distance D from the closest point in A is given by:

            x^2       y^2
          ------- + ------- = 1
          (W+D)^2   (H+D)^2

          Assuming D << W and D << H we can solve for D dropping the terms in
          D^3 and D^4.
          We obtain: a * d^2 + b * d + c = 0
          */

          float c = xx * hh + yy * ww - ww * hh;
          float b = 2.0 * (h * xx + yy * w - h * ww - w * hh);
          float a = xx + yy - ww - hh - 4.0 * w * h;

          float delta = sqrt(b * b - 4.0 * a * c);
          //float solution1 = (-b + delta) / (2.0 * a);
          float solution2 = (-b - delta) / (2.0 * a);

          return smoothstep(-e, e, solution2);
        }



        void main () {
          vec2 strokeSize = dimensions / 2.0 + strokeWidth;
          vec2 fillSize = dimensions / 2.0 - strokeWidth;

          float alpha;
          float fillVsStroke;

          if (sh == 1) {
            alpha = 1.0 - smoothEllipse(localPosition, strokeSize);
            fillVsStroke = smoothEllipse(localPosition, fillSize);
          } else {
            alpha = mirrorStep(strokeSize.x, localPosition.x) * mirrorStep(strokeSize.y, localPosition.y);
            fillVsStroke = 1.0 - mirrorStep(fillSize.x, localPosition.x) * mirrorStep(fillSize.y, localPosition.y);
          }

          vec3 color = mix(fill, stroke, fillVsStroke);


          // darkness effect
          vec4 darknessColor = vec4(0.1, 0.1, 0.1, 1.0);
          float d = distance(worldPosition, darknessFocus) / 10.0;
          float i = 1.0 - 0.9 * darknessIntensity;
          gl_FragColor = opacity * alpha * mix(vec4(color, 1.0), darknessColor, smoothstep(i, i + 0.1, d));
        }
    |]
