module Assets.Tiles exposing (..)

import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Svgl.Tree exposing (SvglNode, defaultParams, ellipse, rect)
import TileCollision exposing (Collision, RowColumn, TileCollider)
import TransformTree exposing (Node(..))
import Vector exposing (Vector)


type alias TileType =
    { render : SvglNode
    , collider : TileCollider SquareCollider
    }


type Delta
    = Increases
    | Decreases


type SquareCollider
    = X Delta
    | Y Delta


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



-- Tile Colliders


collideWhenXIncreases : TileCollider SquareCollider
collideWhenXIncreases =
    TileCollision.collideWhenXIncreases
        |> TileCollision.map (\() -> X Increases)


collideWhenXDecreases : TileCollider SquareCollider
collideWhenXDecreases =
    TileCollision.collideWhenXIncreases
        |> TileCollision.invertX
        |> TileCollision.map (\() -> X Decreases)


collideWhenYIncreases : TileCollider SquareCollider
collideWhenYIncreases =
    TileCollision.collideWhenXIncreases
        |> TileCollision.flipXY
        |> TileCollision.map (\() -> Y Increases)


collideWhenYDecreases : TileCollider SquareCollider
collideWhenYDecreases =
    TileCollision.collideWhenXIncreases
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
    { collider = TileCollision.collideNever
    , render = Nest [] []
    }


transparentBlocker : TileType
transparentBlocker =
    { collider = squareObstacle
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
    { collider = squareObstacle
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
    { collider = collideWhenYDecreases
    , render =
        Nest
            []
            [ rect
                { defaultParams
                    | fill = vec3 0.5 0.5 1
                    , stroke = vec3 0 0 0.5
                    , y = 0.4
                    , h = 0.2
                }
            ]
    }


crossedStruts : TileType
crossedStruts =
    { collider =
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
    { collider = squareObstacle
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
