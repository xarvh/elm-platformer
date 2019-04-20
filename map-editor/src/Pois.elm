module Pois exposing (..)

-- Points Of Interest

import Char
import Dict exposing (Dict)
import Parser
    exposing
        ( (|.)
        , (|=)
        , Parser
        , float
        , spaces
        , succeed
        , symbol
        , variable
        )
import Set
import Vector exposing (Vector)


type alias Pois =
    Dict String Vector


point : Parser Vector
point =
    succeed Vector
        |. symbol "{"
        |. spaces
        |. symbol "x"
        |. spaces
        |. symbol "="
        |. spaces
        |= float
        |. spaces
        |. symbol ","
        |. spaces
        |. symbol "y"
        |. spaces
        |. symbol "="
        |. spaces
        |= float
        |. spaces
        |. symbol "}"


pointList : Parser (List Vector)
pointList =
    Parser.sequence
        { start = "["
        , separator = ","
        , end = "]"
        , spaces = spaces
        , item = point
        , trailing = Parser.Optional
        }


keyValue : Parser ( String, Vector )
keyValue =
    succeed Tuple.pair
        |. spaces
        |= variable
            { start = Char.isLower
            , inner = \c -> Char.isAlphaNum c || c == '_'
            , reserved = Set.empty
            }
        |. spaces
        |. symbol "="
        |. spaces
        |= point
        |. spaces


pois : Parser Pois
pois =
    { start = "{"
    , separator = ","
    , end = "}"
    , spaces = spaces
    , item = keyValue
    , trailing = Parser.Optional
    }
        |> Parser.sequence
        |> Parser.map Dict.fromList


parse : String -> Result (List Parser.DeadEnd) Pois
parse s =
    Parser.run pois s
