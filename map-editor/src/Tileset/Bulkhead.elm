module Tileset.Bulkhead exposing (..)

import Task
import Tileset exposing (Tileset)
import WebGL.Texture exposing (Texture)


load : (String -> String) -> (Result String Tileset -> msg) -> Cmd msg
load nameToUrl msg =
    let
        name =
            "bulkhead"

        url =
            nameToUrl name
    in
    name
        |> nameToUrl
        |> WebGL.Texture.loadWith
            { magnify = WebGL.Texture.nearest
            , minify = WebGL.Texture.nearest
            , horizontalWrap = WebGL.Texture.mirroredRepeat
            , verticalWrap = WebGL.Texture.mirroredRepeat
            , flipY = True
            }
        |> Task.mapError (always <| "could not load `" ++ url ++ "`")
        |> Task.map (textureToTileset name)
        |> Task.attempt msg


textureToTileset : String -> Texture -> Tileset
textureToTileset name spriteTexture =
    let
        fourSides =
            Just Tileset.BlockerFourSides

        static =
            Tileset.RenderStatic

        empty =
            Tileset.RenderEmpty

        none =
            Nothing
    in
    { baseFileName = name
    , spriteTexture = spriteTexture
    , spriteRows = 8
    , spriteCols = 8
    , tileTypes =
        --
        -- Empties
        --
        -- Background
        [ { id = 0, render = empty, maybeBlocker = Nothing, layer = 0, alternativeGroupId = 0, maybePatternFragment = Nothing }

        -- Foreground
        , { id = 1, maybeBlocker = Nothing, render = empty, layer = 1, alternativeGroupId = 0, maybePatternFragment = Nothing }

        -- Foreground transparent blocker
        , { id = 2, render = empty, maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Nothing }

        --
        -- PATTERN
        --
        -- lower 3
        , { id = 3, render = static ( 0, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = True, up = True, down = False } }
        , { id = 4, render = static ( 1, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = True, up = True, down = False } }
        , { id = 5, render = static ( 2, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = False, up = True, down = False } }

        -- mid 2
        , { id = 6, render = static ( 0, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = True, up = True, down = True } }
        , { id = 7, render = static ( 2, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = False, up = True, down = True } }

        -- upper 3
        , { id = 8, render = static ( 0, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = True, up = False, down = True } }
        , { id = 9, render = static ( 1, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = True, up = False, down = True } }
        , { id = 10, render = static ( 2, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = False, up = False, down = True } }

        -- vertical
        , { id = 11, render = static ( 3, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = False, up = True, down = False } }
        , { id = 12, render = static ( 3, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = False, up = True, down = True } }
        , { id = 13, render = static ( 3, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = False, up = False, down = True } }

        -- horizontal
        , { id = 14, render = static ( 0, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = True, up = False, down = False } }
        , { id = 15, render = static ( 1, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = True, up = False, down = False } }
        , { id = 16, render = static ( 2, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = False, up = False, down = False } }

        -- full
        , { id = 17, render = static ( 3, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = False, right = False, up = False, down = False } }

        -- empty
        , { id = 18, render = empty, maybeBlocker = Nothing, layer = 1, alternativeGroupId = 0, maybePatternFragment = Just { patternId = 0, left = True, right = True, up = True, down = True } }

        --- corners
        , { id = 19, render = static ( 4, 0 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePatternFragment = Nothing }
        , { id = 20, render = static ( 4, 1 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePatternFragment = Nothing }
        , { id = 21, render = static ( 5, 0 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePatternFragment = Nothing }
        , { id = 22, render = static ( 5, 1 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePatternFragment = Nothing }

        ---
        --- Background
        ---
        , { id = 23, render = static ( 6, 0 ), maybeBlocker = none, layer = 0, alternativeGroupId = 1, maybePatternFragment = Nothing }
        , { id = 24, render = static ( 7, 0 ), maybeBlocker = none, layer = 0, alternativeGroupId = 1, maybePatternFragment = Nothing }
        ]
    }
