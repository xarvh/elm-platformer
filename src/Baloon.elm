module Baloon exposing (..)

import Game exposing (..)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Svg exposing (Svg)
import Svg.Attributes as SA
import Viewport.Combine


component =
    componentNamespace "baloon"


colorComponent =
    -- TODO have a color type
    component.int "color" 0



------
{-
   entitySays : String -> Game -> Entity -> Entity
   entitySays content game entity =
     let
         cBaloonEndTime = component "baloonEndTime"

         baloonDuration = 5
     in
       entity
         |> cBaloon.set (game.time + baloonDuration)
         |> appendThinkFunctions
             [ --\env game entity ->
             ]
         |> appendRenderFunctions
             [renderBaloon
             ]







   type alias BaloonArgs =
       { maybeOrigin :
          { origin : Vector
          , minimumDistance : Float
          }
       , content : List String

       {-
          , showPressToContinue: Bool
          , scream: Bool
          , radio: Bool
          , think: Bool
          , font: FontFace
       -}
       }

-}


init : String -> UpdateEntityFunction
init text env maybeParent game entity =
    toTriple
        ( entity
            |> setPositionsFromRelative maybeParent { x = 0.3, y = 1.5 }
            |> appendRenderFunctions
                [ baloon
                ]
        , uLater 5 (uDeleteEntity entity.id) env game
        )


baloon : RenderFunction
baloon env game entity =
    let
        content =
            "This is a terrible idea..."

        averageSymbolWidth =
            0.35

        textW =
            toFloat (String.length content) * averageSymbolWidth

        margin =
            0.5

        baloonH =
            2 * margin + 0.6

        baloonW =
            2 * margin + textW

        p =
            [ "M 0 0"
            , "v 1"
            , "h -2"
            , "v " ++ String.fromFloat baloonH
            , "h " ++ String.fromFloat baloonW
            , "v " ++ String.fromFloat -baloonH
            , "L 0.5 1"
            , "z"
            ]
    in
    Svg.g
        [ env.worldToCamera
            |> Mat4.translate3 entity.absolutePosition.x entity.absolutePosition.y 0
            |> Viewport.Combine.transform
        ]
        [ Svg.path
            [ SA.d (String.join " " p)
            , SA.fill "white"
            , SA.stroke "black"
            , SA.strokeWidth "0.1"
            ]
            []
        , Svg.text_
            [ SA.transform "scale(1, -1)"
            , SA.x "-1.5"
            , SA.y "-1.5"
            , SA.style "font-size: 1"
            , SA.textLength <| String.fromFloat textW
            ]
            [ Svg.text content ]
        ]
        |> RenderableSvg
