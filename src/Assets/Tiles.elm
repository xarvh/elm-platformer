module Assets.Tiles exposing (..)

import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import Math.Vector3 as Vec3 exposing (Vec3, vec3)
import Svgl.Tree exposing (..)
import TileCollision exposing (RowColumn, TileCollider)


type alias TileType =
    { render : Node
    , collider : TileCollider SquareCollider
    }


type Delta
    = Increases
    | Decreases


type SquareCollider
    = X Delta
    | Y Delta



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
    , render = Nod [] []
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
        Nod
            []
            [ rect
                { defaultParams
                    | fill = vec3 0 0 0.5
                    , stroke = vec3 0.5 0.5 1
                }
            ]
    }


oneWayPlatform : TileType
oneWayPlatform =
    { collider = collideWhenYDecreases
    , render =
        Nod
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
        Nod
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
        Nod
            []
            [ rect
                { defaultParams
                    | fill = vec3 0.5 0.3 0.2
                    , stroke = vec3 0.2 0.1 0.1
                }
            ]
    }
