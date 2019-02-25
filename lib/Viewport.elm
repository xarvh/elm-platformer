module Viewport exposing (..)

import Browser.Dom
import Browser.Events
import Html exposing (Attribute, Html, div)
import Html.Attributes exposing (style)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Task
import WebGL


-- Types


type alias PixelSize =
    { width : Int
    , height : Int
    }


type alias PixelPosition =
    { top : Int
    , left : Int
    }


type alias WorldSize =
    { width : Float
    , height : Float
    }


type alias WorldPosition =
    { x : Float
    , y : Float
    }



-- Window getters


getWindowSize : (PixelSize -> msg) -> Cmd msg
getWindowSize msgConstructor =
    let
        viewportToMsg viewport =
            msgConstructor
                { width = floor viewport.viewport.width
                , height = floor viewport.viewport.height
                }
    in
    Task.perform viewportToMsg Browser.Dom.getViewport


onWindowResize : (PixelSize -> msg) -> Sub msg
onWindowResize msgConstructor =
    Browser.Events.onResize (\w h -> msgConstructor { width = w, height = h })


{-| Find the scaling factors that ensure that a given world size will be entirely
contained in the pixel space
-}
worldToPixelScale : PixelSize -> WorldSize -> Float
worldToPixelScale pixelSize minimumVisibleWorldSize =
    let
        maxScaleX =
            toFloat pixelSize.width / minimumVisibleWorldSize.width

        maxScaleY =
            toFloat pixelSize.height / minimumVisibleWorldSize.height
    in
    min maxScaleX maxScaleY


pixelToWorld : PixelSize -> WorldSize -> PixelPosition -> WorldPosition
pixelToWorld pixelSize minimumVisibleWorldSize pixelPosition =
    let
        pixelX =
            pixelPosition.left - pixelSize.width // 2

        pixelY =
            1 - pixelPosition.top + pixelSize.height // 2

        scale =
            worldToPixelScale pixelSize minimumVisibleWorldSize
    in
    { x = toFloat pixelX * scale
    , y = toFloat pixelY * scale
    }


worldToPixel : PixelSize -> WorldSize -> WorldPosition -> PixelPosition
worldToPixel pixelSize minimumVisibleWorldSize worldPosition =
    let
        scale =
            worldToPixelScale pixelSize minimumVisibleWorldSize

        pixelX =
            worldPosition.x / scale

        pixelY =
            worldPosition.y / scale
    in
    { left = floor pixelX + pixelSize.width // 2
    , top = 1 - floor pixelY + pixelSize.height // 2
    }


worldToCameraTransform : PixelSize -> WorldSize -> Mat4
worldToCameraTransform pixelSize minimumVisibleWorldSize =
    let
        scale =
            worldToPixelScale pixelSize minimumVisibleWorldSize

        scaleX =
            2.0 * scale / toFloat pixelSize.width

        scaleY =
            2.0 * scale / toFloat pixelSize.height
    in
    Mat4.makeScale (vec3 scaleX scaleY 1)



-- DOM element


toFullWindowHtml : PixelSize -> List WebGL.Entity -> Html a
toFullWindowHtml pixelSize entities =
    div
        [ style "width" "100vw"
        , style "height" "100vh"
        , style "overflow" "hidden"
        ]
        [ WebGL.toHtmlWith
            -- TODO get these from args
            [ WebGL.alpha True
            , WebGL.antialias
            ]
            [ style "width" "100vw"
            , style "height" "100vh"
            , Html.Attributes.width pixelSize.width
            , Html.Attributes.height pixelSize.height
            ]
            entities
        ]
