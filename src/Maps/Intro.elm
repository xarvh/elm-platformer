module Maps.Intro exposing (..)

import Map


main =
    Map.prog map


map =
    Map.define
        { foreground =
            [ "    #####################################################################"
            , "    #                                                         ###########"
            , "    #                                                         ###########"
            , "    #                             [    ]                      ###########"
            , "    #        [                                         [    ] ###########"
            , "    #                                                         ###########"
            , "    #                                                         ###########"
            , "    #                                      X                  ###########"
            , "    #  D  1                               XXX                 ###########"
            , "    #  D  1                       X      X###                           X"
            , "    #####################################################################"
            ]
        , background =
            [ "    #####################################################################"
            , "    #####################################################################"
            , "    ##########################   ########################################"
            , "    ##########################   ########################################"
            , "    ###########   ############3  ########################################"
            , "    ###########   #######################################################"
            , "    ###########3  #######################################################"
            , "    #####################################################################"
            , "    #####################################################################"
            , "    ##########################################################          X"
            , "    #####################################################################"
            ]
        , pois =
            { exit = { x = 70.95674300254453, y = 0.9287531806615763 }
            , learnToCrawl = { x = 57.27226463104326, y = 5.559796437659032 }
            , learnToJump = { x = 29.918575063613233, y = 6.653944020356234 }
            , learnToMove = { x = 15.465648854961831, y = 6.195928753180661 }
            , startingPosition = { x = 6.4325699745547045, y = 1.5394402035623407 }
            }
        }
