{-
   The game itself and the Map Editor use each a different Map
   module.

   This is the game version, it lives in src/map instead than
   just src/ so that the map-editor can override it simply by
   not including src/map/ in its elm.json
-}


module Map exposing (..)

import Array exposing (Array)
import Game
import Html
import Tiles


type alias RawMap pointsOfInterest =
    { foreground : List String
    , background : List String
    , pois : pointsOfInterest
    }


type alias Game game =
    { game
        | mapBackgroundTiles : Array Tiles.BackgroundTile
        , mapForegroundTiles : Array Tiles.ForegroundTile
        , mapWidth : Int
        , mapHeight : Int
    }


type alias UsableMap pointsOfInterest game =
    { pois : pointsOfInterest
    , set : Game game -> Game game
    }


define : RawMap pointsOfInterest -> UsableMap pointsOfInterest game
define raw =
    { pois = raw.pois
    , set =
        \game ->
            { game
                | mapWidth =
                    raw.foreground
                        |> List.map String.length
                        |> List.maximum
                        |> Maybe.withDefault 1
                , mapHeight =
                    List.length raw.foreground
                , mapForegroundTiles =
                    stringToTiles Tiles.idToForegroundTile raw.foreground
                , mapBackgroundTiles =
                    stringToTiles Tiles.idToBackgroundTile raw.background
            }
    }


stringToTiles : (Char -> tile) -> List String -> Array tile
stringToTiles idToTile tilesAsStrings =
    tilesAsStrings
        -- TODO pad to width? For now can assume correctness
        |> String.join ""
        |> String.toList
        |> List.map idToTile
        |> Array.fromList


prog _ =
    Html.text "this should not happen"
