module SpeechBubble exposing (..)

import Dict
import Game exposing (..)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Svg exposing (Svg)
import Svg.Attributes as SA
import Vector exposing (Vector)
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
        args : RenderArgs
        args =
            { content = content
            , offscreen = maybeParentId == Nothing
            }

        init : EntityUpdateFunction
        init env _ game entity =
            toTriple
                ( entity
                    |> appendRenderFunctions
                        [ render args
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


type alias RenderArgs =
    { offscreen : Bool
    , content : String
    }


render : RenderArgs -> RenderFunction
render args env game entity =
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

        { path, offset, textX, textY } =
            if args.offscreen then
                let
                    marginFromTop =
                        1.0

                    yOffset =
                        env.visibleWorldSize.height / 2 - marginFromTop - bubbleH / 2
                in
                { path =
                    [ "M " ++ String.fromFloat (bubbleW / -2) ++ " " ++ String.fromFloat (bubbleH / -2)
                    , "v " ++ String.fromFloat bubbleH
                    , "h " ++ String.fromFloat bubbleW
                    , "v " ++ String.fromFloat -bubbleH
                    , "z"
                    ]
                , offset = Mat4.translate3 game.cameraPosition.x (game.cameraPosition.y + yOffset) 0
                , textX = String.fromFloat <| -bubbleW / 2 + 0.5
                , textY = String.fromFloat <| bubbleH / 2 - 0.5
                }
            else
                let
                    xOffset =
                        0.3

                    yOffset =
                        1.5
                in
                { path =
                    [ "M 0 0"
                    , "v 1"
                    , "h -2"
                    , "v " ++ String.fromFloat bubbleH
                    , "h " ++ String.fromFloat bubbleW
                    , "v " ++ String.fromFloat -bubbleH
                    , "L 0.5 1"
                    , "z"
                    ]
                , offset = Mat4.translate3 (entity.absolutePosition.x + xOffset) (entity.absolutePosition.y + yOffset) 0
                , textX = "-1.5"
                , textY = "-1.5"
                }
    in
    Svg.g
        [ env.worldToCamera
            |> offset
            |> Viewport.Combine.transform
        , if textW == 0 then
            SA.opacity "0"
          else
            SA.class ""
        ]
        [ Svg.path
            [ SA.d (String.join " " path)
            , SA.fill "white"
            , SA.stroke "black"
            , SA.strokeWidth "0.1"
            ]
            []
        , Svg.text_
            [ SA.class "speech-baloon"
            , SA.id (String.fromInt entity.id)
            , SA.transform "scale(1, -1)"
            , SA.x textX
            , SA.y textY
            , SA.fontSize "1"
            , if textW /= 0 then
                SA.textLength <| String.fromFloat textW
              else
                SA.class ""
            ]
            [ Svg.text args.content ]
        ]
        |> RenderableSvg 2
