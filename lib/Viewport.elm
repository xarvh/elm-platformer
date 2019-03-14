module Viewport
    exposing
        ( PixelPosition
        , PixelSize
        , Viewport
        , WorldPosition
        , WorldSize
        , getWindowSize
        , onWindowResize
        , pixelToWorld
        , setMinimumVisibleWorldSize
        , setPixelSize
        , toFullWindowHtml
        , worldToCameraTransform
        , worldToPixel
        )

import Browser.Dom
import Browser.Events
import Html exposing (Attribute, Html, div)
import Html.Attributes exposing (style)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Task
import WebGL


{-| TODO add:

          viewportInWorldCoordinates : PixelSize -> WorldSize -> WorldPosition -> (WorldPosition, WorldPosition)

-}



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


type alias Viewport =
    { pixelSize : PixelSize
    , minimumVisibleWorldSize : WorldSize
    }


{-| Helpers to make your life easier if you want to store a Viewport in your Model
-}
setPixelSize : PixelSize -> Viewport -> Viewport
setPixelSize size viewport =
    { viewport | pixelSize = size }


setMinimumVisibleWorldSize : WorldSize -> Viewport -> Viewport
setMinimumVisibleWorldSize size viewport =
    { viewport | minimumVisibleWorldSize = size }


{-| Find the scaling factors that ensure that a given world size will be entirely
contained in the pixel space
-}
worldToPixelScale : Viewport -> Float
worldToPixelScale { pixelSize, minimumVisibleWorldSize } =
    let
        maxScaleX =
            toFloat pixelSize.width / minimumVisibleWorldSize.width

        maxScaleY =
            toFloat pixelSize.height / minimumVisibleWorldSize.height
    in
    min maxScaleX maxScaleY


pixelToWorld : Viewport -> PixelPosition -> WorldPosition
pixelToWorld viewport pixelPosition =
    let
        pixelX =
            pixelPosition.left - viewport.pixelSize.width // 2

        pixelY =
            1 - pixelPosition.top + viewport.pixelSize.height // 2

        scale =
            worldToPixelScale viewport
    in
    { x = toFloat pixelX / scale
    , y = toFloat pixelY / scale
    }


worldToPixel : Viewport -> WorldPosition -> PixelPosition
worldToPixel viewport worldPosition =
    let
        scale =
            worldToPixelScale viewport

        pixelX =
            worldPosition.x * scale

        pixelY =
            worldPosition.y * scale
    in
    { left = floor pixelX + viewport.pixelSize.width // 2
    , top = 1 - floor pixelY + viewport.pixelSize.height // 2
    }


worldToCameraTransform : Viewport -> Mat4
worldToCameraTransform viewport =
    let
        scale =
            worldToPixelScale viewport

        scaleX =
            2.0 * scale / toFloat viewport.pixelSize.width

        scaleY =
            2.0 * scale / toFloat viewport.pixelSize.height
    in
    Mat4.makeScale3 scaleX scaleY 1



-- Full Window stuff


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
