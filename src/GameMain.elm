module GameMain exposing (..)

import Dict exposing (Dict)
import Game exposing (..)
import Math.Matrix4 as Mat4 exposing (Mat4)
import Random
import Svg exposing (Svg)
import Svgl.Primitives exposing (Uniforms)
import Svgl.Tree
import TransformTree exposing (Node(..))
import Vector
import WebGL


darknessSpeed =
    100



-- Init


init : List UpdateFunction -> ( Game, List Outcome )
init fs =
    List.foldl (applyOneInitFunction Game.updateEnvNeutral) ( Game.new, [] ) fs


applyOneInitFunction : UpdateEnv -> UpdateFunction -> ( Game, List Outcome ) -> ( Game, List Outcome )
applyOneInitFunction env f ( game, os ) =
    f env game
        |> Tuple.mapSecond (\o -> o :: os)



-- Update


update : UpdateEnv -> Game -> ( Game, List Outcome )
update env game =
    { game | time = game.time + env.dt }
        |> updateDarkness env.dt
        |> updateEntities env
        |> executeAllLaters env


updateDarkness : Seconds -> Game -> Game
updateDarkness dt game =
    { game
        | darknessState =
            if game.darknessTarget > game.darknessState then
                game.darknessState + darknessSpeed * dt |> min game.darknessTarget
            else
                game.darknessState - darknessSpeed * dt |> max game.darknessTarget
    }


updateEntities : UpdateEnv -> Game -> ( Game, List Outcome )
updateEntities env game =
    List.foldl (entityUpdate env Nothing) ( game, [] ) game.rootEntitiesIds


entityUpdate : UpdateEnv -> Maybe Parent -> Id -> ( Game, List Outcome ) -> ( Game, List Outcome )
entityUpdate env maybeParent id ( game, os ) =
    case Dict.get id game.entitiesById of
        Nothing ->
            ( game, os )

        Just entity ->
            let
                ( e_, g, o ) =
                    List.foldl
                        (entityExecuteOneUpdateFunction env maybeParent)
                        ( entity, game, os )
                        entity.wrappedUpdateFunctions

                e =
                    updateAbsoluteVectors maybeParent e_

                entitiesById =
                    -- NOTE: if any delta modifies a parent's absolute position, the children's positions will NOT be updated!!!!
                    Dict.insert id e g.entitiesById
            in
            List.foldl
                (entityUpdate env <| Just <| Parent e)
                ( { g | entitiesById = entitiesById }
                , o
                )
                e.childrenIds


entityExecuteOneUpdateFunction : UpdateEnv -> Maybe Parent -> WrappedEntityUpdateFunction -> ( Entity, Game, List Outcome ) -> ( Entity, Game, List Outcome )
entityExecuteOneUpdateFunction env maybeParent (WrapEntityFunction f) ( entity, game, os ) =
    let
        ( e, w, o ) =
            f env maybeParent game entity
    in
    ( e, w, o :: os )


updateAbsoluteVectors : Maybe Parent -> Entity -> Entity
updateAbsoluteVectors maybeParent entity =
    case maybeParent of
        Nothing ->
            entity

        Just (Parent parent) ->
            { entity
                | absolutePosition = Vector.add parent.absolutePosition entity.relativePosition
                , absoluteVelocity = Vector.add parent.absoluteVelocity entity.relativeVelocity
            }


executeAllLaters : UpdateEnv -> ( Game, List Outcome ) -> ( Game, List Outcome )
executeAllLaters env ( game, os ) =
    let
        ( latersToRunNow, latersToRunLater ) =
            List.partition (\( timestamp, later ) -> timestamp <= game.time) game.laters

        latersDeltas =
            List.map Tuple.second latersToRunNow
    in
    List.foldl (executeOneLater env) ( { game | laters = latersToRunLater }, os ) latersToRunNow


executeOneLater : UpdateEnv -> ( Seconds, WrappedUpdateFunction ) -> ( Game, List Outcome ) -> ( Game, List Outcome )
executeOneLater env ( timestamp, WrapFunction f ) ( game, os ) =
    f env game
        |> Tuple.mapSecond (\o -> o :: os)



--
-- Render
--


type alias RenderOutput =
    ( List WebGL.Entity, List (Int, Svg Never) )


renderEntities : Uniforms -> RenderEnv -> Game -> (List WebGL.Entity, List (Svg Never))
renderEntities baseUniforms env game =
    let
        leafToWebGl =
            Svgl.Tree.svglLeafToWebGLEntity baseUniforms

        executeOneRenderFunction : Entity -> RenderScript -> RenderOutput -> RenderOutput
        executeOneRenderFunction entity (RenderScript renderFunction) output =
            case renderFunction env game entity of
                RenderableNone ->
                    output

                RenderableTree tree ->
                    Tuple.mapFirst (TransformTree.resolveAndAppend leafToWebGl Mat4.identity tree) output

                RenderableSvg zIndex svg ->
                    Tuple.mapSecond ((::) (zIndex, svg)) output

                RenderableWebGL entities ->
                    Tuple.mapFirst ((++) entities) output

        executeAllRenderFunctions : Id -> Entity -> RenderOutput -> RenderOutput
        executeAllRenderFunctions id entity output =
            List.foldr (executeOneRenderFunction entity) output entity.renderScripts
    in
    game.entitiesById
        |> Dict.foldl executeAllRenderFunctions ( [], [] )
        |> Tuple.mapSecond (List.sortBy Tuple.first >> List.map Tuple.second)
