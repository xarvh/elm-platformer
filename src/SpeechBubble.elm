module SpeechBubble exposing (..)

import Game exposing (..)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Svg exposing (Svg)
import Svg.Attributes as SA
import Viewport.Combine


averageSymbolWidth =
    0.43


component =
    componentNamespace "bubble"


colorComponent =
    -- TODO have a color type
    component.int "color" 0



{-
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


uNew : Maybe Id -> String -> UpdateFunction -> UpdateFunction
uNew maybeParentId content onDone =
            uNewEntity 
                [ SpeechBubble.withTail content ]
                env
                game



defaultDuration : String -> Float
defaultDuration content =
    3.0 + 0.1 * toFloat (String.length content)


offscreen : String -> UpdateEntityFunction
offscreen content env maybeParent game entity =
    toTriple
        ( entity
            |> appendRenderFunctions
                [ renderOffscreen content
                ]
        , uLater (defaultDuration content) (uDeleteEntity entity.id) env game
        )


withTail : String -> UpdateEntityFunction
withTail content env maybeParent game entity =
    toTriple
        ( entity
            |> setPositionsFromRelative maybeParent { x = 0.3, y = 1.5 }
            |> appendRenderFunctions
                [ renderWithTail content
                ]
        , uLater (defaultDuration content) (uDeleteEntity entity.id) env game
        )


renderWithTail : String -> RenderFunction
renderWithTail content env game entity =
    let
        textW =
            toFloat (String.length content) * averageSymbolWidth

        margin =
            0.5

        bubbleH =
            2 * margin + 0.6

        bubbleW =
            2 * margin + textW

        p =
            [ "M 0 0"
            , "v 1"
            , "h -2"
            , "v " ++ String.fromFloat bubbleH
            , "h " ++ String.fromFloat bubbleW
            , "v " ++ String.fromFloat -bubbleH
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
            , SA.class "speech-baloon"
            ]
            [ Svg.text content ]
        ]
        |> RenderableSvg 2


renderOffscreen : String -> RenderFunction
renderOffscreen content env game entity =
    let
        textW =
            toFloat (String.length content) * averageSymbolWidth

        margin =
            0.5

        bubbleH =
            2 * margin + 0.6

        bubbleW =
            2 * margin + textW

        marginFromTop =
            1.0

        yOffset =
            env.visibleWorldSize.height / 2 - marginFromTop - bubbleH / 2

        p =
            [ "M " ++ String.fromFloat (bubbleW / -2) ++ " " ++ String.fromFloat (bubbleH / -2)
            , "v " ++ String.fromFloat bubbleH
            , "h " ++ String.fromFloat bubbleW
            , "v " ++ String.fromFloat -bubbleH
            , "z"
            ]
    in
    Svg.g
        [ env.worldToCamera
            |> Mat4.translate3 game.cameraPosition.x (game.cameraPosition.y + yOffset) 0
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
            , SA.x <| String.fromFloat <| -bubbleW / 2 + 0.5
            , SA.y <| String.fromFloat <| bubbleH / 2 - 0.5
            , SA.style "font-size: 1"
            , SA.textLength <| String.fromFloat textW
            , SA.class "speech-baloon"
            ]
            [ Svg.text content ]
        ]
        |> RenderableSvg 2
