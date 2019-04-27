module Tiles exposing (..)

import Color exposing (Color, hsl, hsla)
import Dict exposing (Dict)
import Svgl.Tree exposing (TreeNode, defaultParams, ellipse, rect)
import TileCollision exposing (Collision, RowColumn, TileCollider)
import TransformTree exposing (Node(..))
import Vector exposing (Vector)


platformThickness =
    0.2


type alias ForegroundTile =
    { id : Char
    , jumpDown : Bool
    , hasCeilingSpace : Bool
    , isLadder : Bool
    , render : TreeNode
    , collider : TileCollider SquareCollider
    }


type alias BackgroundTile =
    { id : Char
    , render : TreeNode
    }


type Delta
    = Increases
    | Decreases


type SquareCollider
    = X Delta
    | Y Delta



-- Fix Speed


fixSpeed : List (Collision SquareCollider) -> Vector -> Vector
fixSpeed collisions speed =
    let
        sp collision v =
            case collision.geometry of
                X Increases ->
                    { v | x = min 0 v.x }

                X Decreases ->
                    { v | x = max 0 v.x }

                Y Increases ->
                    { v | y = min 0 v.y }

                Y Decreases ->
                    { v | y = max 0 v.y }
    in
    List.foldl sp speed collisions



--


foregroundTilesById : Dict Char ForegroundTile
foregroundTilesById =
    [ foregroundNone
    , transparentBlocker
    , rivetedBlocker
    , oneWayPlatform
    , crossedStruts
    , ground
    , ladder
    ]
        |> List.foldl (\tile accum -> Dict.insert tile.id tile accum) Dict.empty


idToForegroundTile : Char -> ForegroundTile
idToForegroundTile id =
    Maybe.withDefault foregroundNone (Dict.get id foregroundTilesById)


backgroundTilesById : Dict Char BackgroundTile
backgroundTilesById =
    [ backgroundNone
    ]
        |> List.foldl (\tile accum -> Dict.insert tile.id tile accum) Dict.empty


idToBackgroundTile : Char -> BackgroundTile
idToBackgroundTile id =
    Maybe.withDefault backgroundNone (Dict.get id backgroundTilesById)



-- Tile Colliders


collideWhenXIncreases : TileCollider SquareCollider
collideWhenXIncreases =
    TileCollision.thickCollideWhenXIncreases
        |> TileCollision.map (\() -> X Increases)


collideWhenXDecreases : TileCollider SquareCollider
collideWhenXDecreases =
    TileCollision.thickCollideWhenXIncreases
        |> TileCollision.invertX
        |> TileCollision.map (\() -> X Decreases)


collideWhenYIncreases : TileCollider SquareCollider
collideWhenYIncreases =
    TileCollision.thickCollideWhenXIncreases
        |> TileCollision.flipXY
        |> TileCollision.map (\() -> Y Increases)


collideWhenYDecreases : TileCollider SquareCollider
collideWhenYDecreases =
    TileCollision.thickCollideWhenXIncreases
        |> TileCollision.invertX
        |> TileCollision.flipXY
        |> TileCollision.map (\() -> Y Decreases)


squareObstacle : TileCollider SquareCollider
squareObstacle =
    TileCollision.combine
        [ collideWhenYIncreases
        , collideWhenYDecreases
        , collideWhenXIncreases
        , collideWhenXDecreases
        ]



-- Foreground Tiles


foregroundNone : ForegroundTile
foregroundNone =
    { id = ' '
    , jumpDown = False
    , hasCeilingSpace = True
    , isLadder = False
    , collider = TileCollision.collideNever
    , render = Nest [] []
    }


transparentBlocker : ForegroundTile
transparentBlocker =
    { id = '\''
    , jumpDown = False
    , hasCeilingSpace = False
    , isLadder = False
    , collider = squareObstacle
    , render =
        rect
            { defaultParams
                | fill = Color.white
                , stroke = Color.red
                , opacity = 0.5
            }
    }


rivetedBlocker : ForegroundTile
rivetedBlocker =
    { id = '#'
    , jumpDown = False
    , hasCeilingSpace = False
    , isLadder = False
    , collider = squareObstacle
    , render =
        let
            re =
                { defaultParams
                    | fill = Color.grey
                    , stroke = Color.lightGrey
                }

            ell =
                { defaultParams
                    | fill = Color.lightGrey

                    --, stroke =
                    , strokeWidth = 0
                    , w = 0.1
                    , h = 0.1
                }

            o =
                0.37
        in
        Nest
            []
            [ rect re
            , ellipse { ell | x = -o, y = -o }
            , ellipse { ell | x = o, y = -o }
            , ellipse { ell | x = o, y = o }
            , ellipse { ell | x = -o, y = o }
            ]
    }


oneWayPlatform : ForegroundTile
oneWayPlatform =
    { id = '-'
    , jumpDown = True
    , hasCeilingSpace = True
    , isLadder = False
    , collider =
        TileCollision.collideWhenXIncreases platformThickness
            |> TileCollision.invertX
            |> TileCollision.flipXY
            |> TileCollision.map (\() -> Y Decreases)
    , render =
        Nest
            []
            [ rect
                { defaultParams
                    | fill = Color.lightGrey
                    , stroke = Color.grey
                    , y = 0.5 - platformThickness / 2
                    , h = platformThickness
                }
            ]
    }


crossedStruts : ForegroundTile
crossedStruts =
    { id = 'X'
    , jumpDown = False
    , hasCeilingSpace = False
    , isLadder = False
    , collider = squareObstacle
    , render =
        Nest
            []
            [ rect
                { defaultParams
                    | fill = Color.grey
                    , stroke = Color.black
                    , h = 0.2
                    , w = 1.3
                    , rotate = degrees 45
                }
            , rect
                { defaultParams
                    | fill = Color.grey
                    , stroke = Color.black
                    , h = 0.2
                    , w = 1.3
                    , rotate = degrees -45
                }
            , rect
                { defaultParams
                    | fill = Color.grey
                    , stroke = Color.black
                    , y = 0.4
                    , h = 0.2
                }
            , rect
                { defaultParams
                    | fill = Color.grey
                    , stroke = Color.black
                    , y = -0.4
                    , h = 0.2
                }
            ]
    }


ground : ForegroundTile
ground =
    { id = '*'
    , collider = squareObstacle
    , jumpDown = False
    , hasCeilingSpace = False
    , isLadder = False
    , render =
        Nest
            []
            [ rect
                { defaultParams
                    | fill = Color.rgb 0.5 0.3 0.2
                    , stroke = Color.rgb 0.2 0.1 0.1
                }
            ]
    }


ladder : ForegroundTile
ladder =
    { id = 'H'
    , jumpDown = False
    , hasCeilingSpace = True
    , isLadder = True
    , collider = TileCollision.collideNever
    , render =
        let
            params =
                { defaultParams
                    | fill = Color.rgb 0 0.16 1
                    , stroke = Color.rgb 0.13 0.2 0.5
                    , strokeWidth = 0.01
                }
        in
        Nest
            []
            [ rect { params | w = 0.8, h = 0.1, y = 0.25 }
            , rect { params | w = 0.8, h = 0.1, y = 0 }
            , rect { params | w = 0.8, h = 0.1, y = -0.25 }
            , rect { params | w = 0.8, h = 0.1, y = -0.5 }

            -- side supports
            , rect { params | w = 0.15, x = -0.35 }
            , rect { params | w = 0.15, x = 0.35 }
            ]
    }



-- Background tiles


backgroundNone : BackgroundTile
backgroundNone =
    { id = ' '
    , render = Nest [] []
    }
