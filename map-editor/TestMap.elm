module TestContent exposing (..)

import Map


main =
    Map.define
        { content =
            [ "--  "
            , "    "
            , "####"
            ]
        , pois =
            { drone1patrolE = { x = 10, y = 6 }
            , drone1patrolS = { x = 5, y = 6 }
            , startingPosition = { x = 3, y = 4 }
            }
        }
