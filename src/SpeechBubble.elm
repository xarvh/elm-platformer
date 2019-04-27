module SpeechBubble exposing (..)

import Dict
import Game exposing (..)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Svg exposing (Svg)
import Svg.Attributes as SA
import Viewport.Combine


component =
    componentNamespace "bubble"


cTextWidth =
    component.float "textWidth" 0


colorComponent =
    -- TODO have a color type
    component.int "color" 0


defaultDuration : String -> Float
defaultDuration content =
    3.0 + 0.1 * toFloat (String.length content)


uNew : Maybe Id -> String -> UpdateFunction -> UpdateFunction
uNew maybeParentId content onDone =
    let
        render =
            if maybeParentId == Nothing then
                renderOffscreen
            else
                renderWithTail

        init : EntityUpdateFunction
        init env _ game entity =
            toTriple
                ( entity
                    |> appendRenderFunctions
                        [ render content
                        ]
                    |> appendEntityUpdateFunctions
                        [ queryTextWidth
                        ]
                , uLater (defaultDuration content)
                    (uList
                        [ uDeleteEntity entity.id
                        , onDone
                        ]
                    )
                    env
                    game
                )
    in
    uNewEntity maybeParentId [ init ]



-- Query text width from the DOM


queryTextWidth : EntityUpdateFunction
queryTextWidth env maybeParent game entity =
    if cTextWidth.get entity == 0 then
        ( entity, game, OutcomeQueryWidth entity.id )
    else
        ( entity, game, OutcomeNone )


applyWidth : Id -> Float -> Game -> Game
applyWidth id width game =
    { game | entitiesById = Dict.update id (Maybe.map <| cTextWidth.set width) game.entitiesById }


resetAll : Game -> Game
resetAll game =
    let
        resetTextWidth id entity =
            if cTextWidth.get entity == 0 then
                entity
            else
                cTextWidth.set 0 entity
    in
    { game | entitiesById = Dict.map resetTextWidth game.entitiesById }



-- Render


renderWithTail : String -> RenderFunction
renderWithTail content env game entity =
    let
        textWidthAsRatio =
            cTextWidth.get entity

        textW =
            textWidthAsRatio * env.visibleWorldSize.width

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
            |> Mat4.translate3 0.3 1.5 0
            |> Viewport.Combine.transform
        , if textW == 0 then
            SA.opacity "0"
          else
            SA.class ""
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
            , SA.id (String.fromInt entity.id)
            ]
            [ Svg.text content ]
        ]
        |> RenderableSvg 2


renderOffscreen : String -> RenderFunction
renderOffscreen content env game entity =
    let
        textWidthAsRatio =
            cTextWidth.get entity

        textW =
            textWidthAsRatio * env.visibleWorldSize.width

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
        , if textW == 0 then
            SA.opacity "0"
          else
            SA.class ""
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
            , SA.id (String.fromInt entity.id)
            ]
            [ Svg.text content ]
        ]
        |> RenderableSvg 2
