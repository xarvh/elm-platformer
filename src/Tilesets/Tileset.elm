module Tileset.Bulkhead exposing (..)

{-

   * Map Texture
     - Decides which tile type goes where, its values reference the Tileset Texture
     - R, G are the normalized x, y references to the TileType used as foreground
     - B, A are the normalized x, y references to the TileType used as background

   * Tileset Texture
     - Decides how a tile type is drawn.
     - R is the AnimationMode and determines how the other three values are used
     - G, B, A are used according to the value in R
     - Where G, B, A contain durations, they will be measured in frames (ie, chunks of 1/60s)

   * Sprites Texture: it is divided in tiles and determines the final pixel colors

-}


--
-- Types used by the game
--
type alias Map =
  { id : String
  , width : Int
  , height : Int
  , blockers : Array (Maybe Blocker)
  , poisByName : Dict String { x : Float, y : Float }
  , tiles : Texture
  , tileset : Texture
  , sprites : Texture
  }





--
-- Types used by the map editor
--
type alias EditorMap =
  { id : String
  , tileset : Tileset
  , foreground : Dict { l : Int, b : Int } TileTypeReference
  , background : Dict { l : Int, b : Int } TileTypeReference
  , poisByName : Dict String { x : Float, y : Float }
  }

type alias TileTypeReference =
    Int


type alias Tileset =
    { fileName : String

    -- this is used only by the editor, to know what to delete
    , firstUnusedSprite : TileSpritesheetReference
    , tiles : List Tile
    , spriteWidthInTiles : Int
    , spriteHeightInTiles : Int
    }


type alias Tile =
    { idWithinLayer : Int
    , layer : Int
    , maybeBlocker : Maybe Blocker
    , animationMode : AnimationMode

    -- How these ares used depends entirely on the AnimationMode
    , animationDurationInFrames : Int
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
