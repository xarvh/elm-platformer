module Assets.Maps.ThreeWays exposing (..)

import Array exposing (Array)
import Vector exposing (Vector)


width =
    40


height =
    15


startingPosition =
    { x = 8, y = 2 }


drones =
    [ ( Vector 5 5, Vector 9 5 )
    , ( Vector 16 5, Vector 25 5 )
    ]


elevators =
    [ { x = 26, y = 1 }
    , { x = 29, y = 1 }
    ]


terminal =
    { x = 35, y = 1 }


tiles : Array Char
tiles =
    [ "    ####################################"
    , "    #   #               ##    ###      #"
    , "    #   #               ##    ###      #"
    , "    # ###         --    ##H##H##       #"
    , "    #           --  --    H##H##    ####"
    , "    #####     --          H##H         #"
    , "    #       --        --##H##H    --   #"
    , "    #                   ##H##H         #"
    , "    #       --            H##H  --     #"
    , "    #                     H##H         #"
    , "    ######  --  ##########H##H     #####"
    , "    #                     H##H     #####"
    , "    '         ##    ##    H##H         '"
    , "    '                     HXXH         '"
    , "    ####################################"
    ]
        |> String.join ""
        |> String.toList
        |> Array.fromList
