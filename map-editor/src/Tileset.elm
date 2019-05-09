module Tileset exposing (..)

import WebGL.Texture exposing (Texture)


type alias TileType =
    -- id determines where in the tileset texture the type will be stored
    { id : Int
    , render : RenderMode
    , maybeBlocker : Maybe Blocker
    , layer : Int
    , alternativeGroupId : Int
    , maybePattern : Maybe { patternId : Int, closedSides : ClosedSides }
    }


type RenderMode
    = RenderEmpty
    | RenderStatic SpriteId


{-| determines the sprite within the sprites texture
-}
type alias SpriteId =
    ( Int, Int )


type Blocker
    = BlockerFourSides
    | BlockerOneWayPlatform


type alias ClosedSides =
    { left : Bool
    , right : Bool
    , up : Bool
    , down : Bool
    }


type alias Tileset =
    { baseFileName : String
    , tileTypes : List TileType
    -- TODO should this be a maybe? or just a variable type?
    , spriteTexture : Texture
    , spriteRows : Int
    , spriteCols : Int
    }



-- ig api
{-
   load : String -> Tileset


   tileTypeIdToMaybeBlocker : Tileset -> Int -> Maybe Blocker


   render : { mapTexture : Texture } -> Tileset -> { x : Float, y : Float, w : Float, h : Float } -> WebGL.Entity
-}





