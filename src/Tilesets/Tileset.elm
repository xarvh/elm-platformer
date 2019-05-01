module Tileset.Bulkhead exposing (..)


type alias Tileset =
    { fileName : String
    , tiles : List Tile
    , spriteWidthInTiles : Int
    , spriteHeightInTiles : Int
    }


type alias Tile =
    { idWithinLayer : Int
    , layer : Int
    , maybeBlocker : Maybe Blocker
    , animationDurationInFrames : Int
    , animationMode : AnimationMode

    -- How these ares used depends entirely on the AnimationMode
    , animationOffset : Int
    , spriteSheetReferenceA : Int
    , spriteSheetReferenceB : Int
    }


type Blocker
    = OneWayPlatform
    | FourSides


type AnimationMode
    = Static
    | ForwardCycle


tileset : Tileset
tileset =
    { fileName = "bulkhead"
    , spriteWidthInTiles = 8
    , spriteHeightInTiles = 7
    , tiles =
        let
            blockers =
                [ 0 ]
        in
        (8 * 7 - 1)
            |> List.range 0
            |> List.map (makeTile blockers)
    }


makeTile : List Int -> Int -> Tile
makeTile blockers idWithinLayer =
    { idWithinLayer = idWithinLayer
    , layer = 0
    , maybeBlocker = Nothing
    , animationDurationInFrames = 0
    , animationMode = Static

    -- How these ares used depends entirely on the AnimationMode
    , animationOffset = 0
    , spriteSheetReferenceA = idWithinLayer
    , spriteSheetReferenceB = 0
    }
