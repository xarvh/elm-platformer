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





