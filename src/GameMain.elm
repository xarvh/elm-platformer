module GameMain exposing (..)

import Dict exposing (Dict)
import Game exposing (..)
import Random
import Svgl.Tree exposing (SvglNode)
import TransformTree exposing (Node(..))
import WebGL


darknessSpeed =
    100



-- Think


think : ThinkEnv -> Game -> ( Game, List Outcome )
think env game =
    let
        dt =
            -- Cap the integration interval
            min env.dt 0.2

        ( updatedEntitiesById, deltas ) =
            game.entitiesById
                |> Dict.foldl (executeAllThinkFunctions { env | dt = dt } game) ( Dict.empty, [] )

        updatedGame =
            { game
                | entitiesById = updatedEntitiesById
                , time = game.time + dt
                , darknessState =
                    if game.darknessTarget > game.darknessState then
                        game.darknessState + darknessSpeed * dt |> min game.darknessTarget
                    else
                        game.darknessState - darknessSpeed * dt |> max game.darknessTarget
            }
    in
    List.foldl applyDelta ( updatedGame, [] ) deltas


executeAllThinkFunctions : ThinkEnv -> Game -> Id -> Entity -> ( Dict Id Entity, List Delta ) -> ( Dict Id Entity, List Delta )
executeAllThinkFunctions env game id entity ( entitiesById, deltas ) =
    let
        ( updatedEntity, updatedDeltas ) =
            List.foldl (executeThinkFunction env game) ( entity, deltas ) entity.thinkScripts
    in
    ( Dict.insert id updatedEntity entitiesById, updatedDeltas )


executeThinkFunction : ThinkEnv -> Game -> ThinkScript -> ( Entity, List Delta ) -> ( Entity, List Delta )
executeThinkFunction env game (ThinkScript function) ( entity, deltas ) =
    let
        ( updatedEntity, delta ) =
            function env game entity
    in
    ( updatedEntity
    , if delta == DeltaNone then
        deltas
      else
        delta :: deltas
    )


applyDelta : Delta -> ( Game, List Outcome ) -> ( Game, List Outcome )
applyDelta delta ( game, outcomes ) =
    case delta of
        DeltaNone ->
            ( game, outcomes )

        DeltaList list ->
            List.foldl applyDelta ( game, outcomes ) list

        DeltaGame f ->
            ( f game, outcomes )

        DeltaOutcome o ->
            ( game, o :: outcomes )

        DeltaLater delay later ->
            let
                laters =
                    ( game.time + delay, later ) :: game.laters
            in
            ( { game | laters = laters }, outcomes )

        DeltaRandom deltaGenerator ->
            let
                ( d, seed ) =
                    Random.step deltaGenerator game.seed
            in
            applyDelta d ( { game | seed = seed }, outcomes )

        DeltaNeedsUpdatedGame gameToDelta ->
            applyDelta (gameToDelta game) ( game, outcomes )



-- Render


render : RenderEnv -> Game -> SvglNode
render env game =
    game.entitiesById
        |> Dict.foldl (executeAllRenderFunctions env game) []
        |> Nest []


executeAllRenderFunctions : RenderEnv -> Game -> Id -> Entity -> List SvglNode -> List SvglNode
executeAllRenderFunctions env game id entity listOfListsAccumulator =
    List.foldr (executeRenderFunction env game entity) listOfListsAccumulator entity.renderScripts


executeRenderFunction : RenderEnv -> Game -> Entity -> RenderScript -> List SvglNode -> List SvglNode
executeRenderFunction env game entity (RenderScript renderFunction) listOfListsAccumulator =
    renderFunction env game entity :: listOfListsAccumulator
