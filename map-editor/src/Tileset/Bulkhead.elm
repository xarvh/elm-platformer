module Tileset.Bulkhead exposing (..)

import Task
import Tileset exposing (Tileset)
import WebGL.Texture


load : (String -> String) -> Cmd (Result String Tileset)
load nameToUrl =
    let
        name =
            "bulkhead"

        url =
            nameToUrl name
    in
    WebGL.Texture.load (nameToUrl name)
        |> Task.mapError (always <| "could not load `" ++ url ++ "`")
        |> Task.map (textureToTileset name)
        |> Task.attempt identity
        |> Cmd.map


textureToTileset : String -> Texture -> Tileset
textureToTileset name spriteTexture =
    let
        fourSides =
            Just Tileset.BlockerFourSides

        none =
            Nothing
    in
    { name = name
    , spriteTexture = spriteTexture
    , spriteRows = 8
    , spriteCols = 8
    , tilesById =
        --
        -- Empties
        --
        -- Background
        [ { id = 0
          , render = Empty
          , maybeBlocker = none
          , layer = 0
          , alternativeGroupId = 0
          , maybePattern = Nothing
          }

        -- Foreground
        , { id = 1
          , maybeBlocker = Nothing
          , render = Empty
          , layer = 0
          , alternativeGroupId = 0
          , maybePattern = Nothing
          }

        -- Foreground transparent blocker
        , { id = 2
          , render = Empty
          , maybeBlocker = Just Tileset.BlockerFourSides
          , layer = 1
          , alternativeGroupId = 0
          , maybePattern = Nothing
          }

        --
        -- PATTERN
        --
        -- lower 3
        , { id = 3, render = RenderStatic ( 0, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 4, render = RenderStatic ( 1, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 5, render = RenderStatic ( 2, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- mid 2
        , { id = 6, render = RenderStatic ( 0, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 7, render = RenderStatic ( 2, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- upper 3
        , { id = 8, render = RenderStatic ( 0, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 9, render = RenderStatic ( 0, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 10, render = RenderStatic ( 0, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- vertical
        , { id = 11, render = RenderStatic ( 3, 0 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 12, render = RenderStatic ( 3, 1 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 13, render = RenderStatic ( 3, 2 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- horizontal
        , { id = 14, render = RenderStatic ( 0, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 15, render = RenderStatic ( 1, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 16, render = RenderStatic ( 2, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        -- full
        , { id = 17, render = RenderStatic ( 3, 3 ), maybeBlocker = fourSides, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        --- corners
        , { id = 18, render = RenderStatic ( 4, 0 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 19, render = RenderStatic ( 4, 1 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 20, render = RenderStatic ( 5, 0 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }
        , { id = 21, render = RenderStatic ( 5, 1 ), maybeBlocker = none, layer = 1, alternativeGroupId = 0, maybePattern = Nothing }

        ---
        --- Background
        ---
        , { id = 22, render = RenderStatic ( 6, 0 ), maybeBlocker = none, layer = 0, alternativeGroupId = 1, maybePattern = Nothing }
        , { id = 23, render = RenderStatic ( 7, 0 ), maybeBlocker = none, layer = 0, alternativeGroupId = 1, maybePattern = Nothing }
        ]
            |> List.foldl (\t d -> Dict.insert t.id t d) Dict.empty
    }
