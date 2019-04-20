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


define : { tiles : List String, pois : pois } -> { tiles : Array Tiles.TileType, width : Int, height : Int, pois : pois }
define { tiles, pois } =
    { width =
        tiles
            |> List.map String.length
            |> List.maximum
            |> Maybe.withDefault 1
    , height =
        List.length tiles
    , tiles =
        tiles
            |> String.join ""
            |> String.toList
            |> List.map Tiles.idToTileType
            |> Array.fromList
    , pois = pois
    }


prog _ =
    Html.text "this should not happen"
