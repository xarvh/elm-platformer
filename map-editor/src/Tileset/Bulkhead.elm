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
        [ { id = 0, render = empty, maybeBlocker = Nothing, layer = 0, alternativeGroupId = 0, maybePattern = Nothing }

        -- Foreground
        , { id = 1, maybeBlocker = Nothing, render = empty, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- Foreground transparent blocker
        , { id = 2, render = empty, maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        --
        -- PATTERN
        --
        -- lower 3
        , { id = 3, render = static ( 0, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 4, render = static ( 1, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 5, render = static ( 2, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- mid 2
        , { id = 6, render = static ( 0, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 7, render = static ( 2, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- upper 3
        , { id = 8, render = static ( 0, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 9, render = static ( 1, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 10, render = static ( 2, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- vertical
        , { id = 11, render = static ( 3, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 12, render = static ( 3, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 13, render = static ( 3, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- horizontal
        , { id = 14, render = static ( 0, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 15, render = static ( 1, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 16, render = static ( 2, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- full
        , { id = 17, render = static ( 3, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        --- corners
        , { id = 18, render = static ( 4, 0 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 19, render = static ( 4, 1 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 20, render = static ( 5, 0 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 21, render = static ( 5, 1 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        ---
        --- Background
        ---
        , { id = 22, render = static ( 6, 0 ), maybeBlocker = none, layer = 0, alternativeGroupId = 1, maybePattern = Nothing }
        , { id = 23, render = static ( 7, 0 ), maybeBlocker = none, layer = 0, alternativeGroupId = 1, maybePattern = Nothing }
        ]
    }
