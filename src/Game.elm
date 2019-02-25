module Game exposing (..)

import Dict exposing (Dict)
import Map exposing (Delta(..), SquareBlocker(..))
import Math.Vector2 as Vec2 exposing (Vec2, vec2)
import TileCollision
    exposing
        ( AbsoluteAabbTrajectory
        , Collision
        , RowColumn
        )


--


clampToRadius : Float -> Vec2 -> Vec2
clampToRadius radius v =
    let
        ll =
            Vec2.lengthSquared v
    in
    if ll <= radius * radius then
        v
    else
        Vec2.scale (radius / sqrt ll) v



--


baseAcceleration =
    8


maxSpeed =
    10


playerSize =
    { width = 0.5
    , height = 1
    }



--


type alias Game =
    { player : Player
    , time : Float
    }


type alias Player =
    { position : Vec2
    , speed : Vec2
    }


playerInit : Player
playerInit =
    --{ position = vec2 -2.211749543059631 0.012178343439440242
    { position = vec2 -2 1
    , speed = vec2 -2.586545688407802 -1.3333333039685646
    }


playerThink : Float -> { x : Int, y : Int } -> Player -> ( Player, List (Collision SquareBlocker) )
playerThink dt input player =
    let
--         input =
--             { x = -1, y = 0 }

        movementAcceleration =
            vec2 (toFloat input.x * baseAcceleration) (toFloat input.y * baseAcceleration)

        gravityAcceleration =
            vec2 0 (-baseAcceleration / 2)

        friction =
            Vec2.scale -3 player.speed

        totalAcceleration =
            movementAcceleration
                |> Vec2.add gravityAcceleration
                |> Vec2.add friction

        speed =
            totalAcceleration
                |> Vec2.scale dt
                |> Vec2.add player.speed
                |> clampToRadius maxSpeed

        idealPosition =
            speed
                |> Vec2.scale dt
                |> Vec2.add player.position

        collisions =
            TileCollision.collide
                Map.tileAsCollider
                { width = playerSize.width
                , height = playerSize.height
                , start = Vec2.toRecord player.position
                , end = Vec2.toRecord idealPosition
                , minimumDistance = 0.0001
                }

        fixedPosition =
            case collisions of
                [] ->
                    idealPosition

                collision :: cs ->
                    Vec2.fromRecord collision.fix
    in
    ( { player
        | position = fixedPosition
        , speed = fixSpeed ( input, player ) collisions speed
      }
    , collisions
    )


fixSpeed : a -> List (Collision SquareBlocker) -> Vec2 -> Vec2
fixSpeed a collisions speed =
    let
        sp collision ( x, y ) =
            case collision.geometry of
                X Increases ->
                    ( min 0 x, y )

                X Decreases ->
                    let
                        q =
                            List.map (Debug.log "") collisions -- ( a, collisions, speed )
                    in
                    ( max 0 x, y )

                Y Increases ->
                    ( x, min 0 y )

                Y Decreases ->
                    ( x, max 0 y )

        ( xx, yy ) =
            List.foldl sp ( Vec2.getX speed, Vec2.getY speed ) collisions
    in
    vec2 xx yy
