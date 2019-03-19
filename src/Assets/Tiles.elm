module Assets.Tiles exposing (..)

import Dict exposing (Dict)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Svgl.Tree exposing (SvglNode, defaultParams, ellipse, rect)
import TileCollision exposing (Collision, RowColumn, TileCollider)
import TransformTree exposing (Node(..))
import Vector exposing (Vector)


platformThickness =
    0.2


type alias TileType =
    { id : Int
    , jumpDown : Bool
    , hasCeilingSpace : Bool
    , render : SvglNode
    , collider : TileCollider SquareCollider
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


tilesById : Dict Int TileType
tilesById =
    [ none
    , transparentBlocker
    , rivetedBlocker
    , oneWayPlatform
    , crossedStruts
    , ground
    ]
        |> List.foldl (\tile accum -> Dict.insert tile.id tile accum) Dict.empty


intToTileType : Int -> TileType
intToTileType id =
    Maybe.withDefault none (Dict.get id tilesById)



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



-- Tiles


none : TileType
none =
    { id = 0
    , jumpDown = False
    , hasCeilingSpace = True
    , collider = TileCollision.collideNever
    , render = Nest [] []
    }


transparentBlocker : TileType
transparentBlocker =
    { id = 1
    , jumpDown = False
    , hasCeilingSpace = False
    , collider = squareObstacle
    , render =
        rect
            { defaultParams
                | fill = vec3 1 1 1
                , stroke = vec3 1 0 0
                , opacity = 0.5
            }
    }


rivetedBlocker : TileType
rivetedBlocker =
    { id = 2
    , jumpDown = False
    , hasCeilingSpace = False
    , collider = squareObstacle
    , render =
        let
            re =
                { defaultParams
                    | fill = vec3 0 0 0.5
                    , stroke = vec3 0.5 0.5 1
                }

            ell =
                { defaultParams
                    | fill = vec3 0.5 0.5 1

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


oneWayPlatform : TileType
oneWayPlatform =
    { id = 3
    , jumpDown = True
    , hasCeilingSpace = True
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
                    | fill = vec3 0.5 0.5 1
                    , stroke = vec3 0 0 0.5
                    , y = 0.5 - platformThickness / 2
                    , h = platformThickness
                }
            ]
    }


crossedStruts : TileType
crossedStruts =
    { id = 4
    , jumpDown = False
    , hasCeilingSpace = False
    , collider =
        TileCollision.combine
            [ collideWhenYIncreases
            , collideWhenYDecreases
            ]
    , render =
        Nest
            []
            [ rect
                { defaultParams
                    | fill = vec3 0.5 0.5 0.5
                    , stroke = vec3 0 0 0
                    , h = 0.2
                    , w = 1.3
                    , rotate = degrees 45
                }
            , rect
                { defaultParams
                    | fill = vec3 0.5 0.5 0.5
                    , stroke = vec3 0 0 0
                    , h = 0.2
                    , w = 1.3
                    , rotate = degrees -45
                }
            , rect
                { defaultParams
                    | fill = vec3 0.5 0.5 0.5
                    , stroke = vec3 0 0 0
                    , y = 0.4
                    , h = 0.2
                }
            , rect
                { defaultParams
                    | fill = vec3 0.5 0.5 0.5
                    , stroke = vec3 0 0 0
                    , y = -0.4
                    , h = 0.2
                }
            ]
    }


ground : TileType
ground =
    { id = 5
    , collider = squareObstacle
    , jumpDown = False
    , hasCeilingSpace = False
    , render =
        Nest
            []
            [ rect
                { defaultParams
                    | fill = vec3 0.5 0.3 0.2
                    , stroke = vec3 0.2 0.1 0.1
                }
            ]
    }
