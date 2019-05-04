module Tileset exposing (..)

import Dict exposing (Dict)
import Set exposing (Set)


type alias Map =
    { id : String
    , tileset : Tileset
    , foreground : Dict ( Int, Int ) TileType
    , background : Dict ( Int, Int ) TileType
    , poisByName : Dict String { x : Float, y : Float }
    }


type alias Tileset =
    { slugName : String

    -- this is used only by the editor, to know what to delete
    -- TODO, firstUnusedSprite : TileSpritesheetReference
    , tiles : List TileType
    , spriteWidthInTiles : Int
    , spriteHeightInTiles : Int
    }


type alias TileType =
    { idWithinLayer : Int
    , layer : Int
    , maybeBlocker : Maybe Blocker
    , animationMode : AnimationMode

    -- How these ares used depends entirely on the AnimationMode
    , aTilenimationDurationInFrames : Int
    , spriteA : TileSpritesheetReference
    , spriteB : TileSpritesheetReference
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
