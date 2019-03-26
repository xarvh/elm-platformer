module Viewport.Combine exposing (..)

import Html exposing (Html, div)
import Html.Attributes exposing (style)
import Svg exposing (Svg)
import Svg.Attributes
import Viewport
import WebGL


type alias WrapperArgs msg =
    { viewportSize : Viewport.PixelSize
    , elementAttributes : List (Html.Attribute msg)
    , svgContent : List (Svg msg)
    , webglOptions : List WebGL.Option
    , webGlEntities : List WebGL.Entity
    }


wrapper : WrapperArgs msg -> Html msg
wrapper args =
    let
        { width, height } =
            args.viewportSize

        childrenAttributes =
            [ style "position" "absolute"
            , style "top" "0"
            , style "left" "0"
            , style "bottom" "0"
            , style "right" "0"
            ]

        viewbox =
            [ -width
            , -height
            , width * 2
            , height * 2
            ]
                |> List.map String.fromInt
                |> String.join " "
                |> Svg.Attributes.viewBox
    in
    div
        ([ style "position" "relative"
         , style "overflow" "hidden"
         , style "width" (String.fromInt width ++ "px")
         , style "height" (String.fromInt height ++ "px")
         ]
            ++ args.elementAttributes
        )
        [ WebGL.toHtmlWith
            args.webglOptions
            (Html.Attributes.width width :: Html.Attributes.height height :: childrenAttributes)
            args.webGlEntities
        , Svg.svg
            (viewbox :: childrenAttributes)
            [ Svg.g
                [ Svg.Attributes.transform <| "scale(" ++ String.fromInt width ++ ", " ++ String.fromInt -height ++ ")" ]
                args.svgContent
            ]
        ]
