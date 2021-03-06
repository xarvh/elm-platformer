module Viewport
    exposing
        ( PixelPosition
        , PixelSize
        , Viewport
        , WorldPosition
        , WorldSize
        , actualVisibleWorldSize
        , getWindowSize
        , onWindowResize
        , overlaps
        , pixelToWorld
        , worldToCameraTransform
        , worldToPixel
        )

import Browser.Dom
import Browser.Events
import Math.Matrix4 as Mat4 exposing (Mat4)
import Task


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



-- Viewport culling


actualVisibleWorldSize : Viewport -> WorldSize
actualVisibleWorldSize viewport =
    let
        scale =
            worldToPixelScale viewport
    in
    { width = toFloat viewport.pixelSize.width / scale
    , height = toFloat viewport.pixelSize.height / scale
    }


overlaps : Viewport -> WorldPosition -> WorldSize -> WorldPosition -> Bool
overlaps viewport viewportCenter =
    let
        -- size in world coordinates
        { width, height } =
            actualVisibleWorldSize viewport

        left =
            viewportCenter.x - width / 2

        right =
            viewportCenter.x + width / 2

        top =
            viewportCenter.y + height / 2

        bottom =
            viewportCenter.y - height / 2
    in
    \objectSize objectCenter ->
        (objectCenter.x + objectSize.width / 2 > left)
            && (objectCenter.x - objectSize.width / 2 < right)
            && (objectCenter.y + objectSize.height / 2 > bottom)
            && (objectCenter.y - objectSize.height / 2 < top)



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
