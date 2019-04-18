module TileCollision exposing (..)

import List.Extra


{-| Too big, and the mob will stop on corners between square blockers
Too small, gravity will sooner or later push the mob through the floor
-}
minimumDistance =
    0.0001



-- Types


type alias Vec =
    { x : Float
    , y : Float
    }


type alias RowColumn =
    { row : Int
    , column : Int
    }


type alias Collision geometry =
    { geometry : geometry
    , impactPoint : Vec
    , aabbPositionAtImpact : Vec
    , fix : Vec
    , tile : RowColumn

    -- distance between AABB's position at start and at impact
    , distanceSquared : Float
    }


type alias RelativeAabbTrajectory =
    { relativeStart : Vec
    , relativeEnd : Vec
    , halfWidth : Float
    , halfHeight : Float
    }


type alias AbsoluteAabbTrajectory =
    { start : Vec
    , end : Vec
    , width : Float
    , height : Float
    }


{-| Collider

Defines how a certain tile type reacts to an AABB bumping into it

-}
type alias TileCollider geometry =
    RelativeAabbTrajectory -> Maybe (Collision geometry)



-- Vec


distanceSquared : Vec -> Vec -> Float
distanceSquared a b =
    let
        dx =
            a.x - b.x

        dy =
            a.y - b.y
    in
    dx * dx + dy * dy


vecInvertX : Vec -> Vec
vecInvertX v =
    { v | x = -v.x }


vecInvertY : Vec -> Vec
vecInvertY v =
    { v | y = -v.y }


vecFlipXY : Vec -> Vec
vecFlipXY v =
    { x = v.y
    , y = v.x
    }



-- Collision


collisionMap : (a -> b) -> (Vec -> Vec) -> Collision a -> Collision b
collisionMap transformGeometry transformVec c =
    { geometry = transformGeometry c.geometry
    , impactPoint = transformVec c.impactPoint
    , aabbPositionAtImpact = transformVec c.aabbPositionAtImpact
    , fix = transformVec c.fix
    , tile = c.tile
    , distanceSquared = c.distanceSquared
    }



-- Tiles & Vecs


coordinateToTile : Float -> Int
coordinateToTile =
    round


vecToRowColumn : Vec -> RowColumn
vecToRowColumn v =
    { row = coordinateToTile v.y
    , column = coordinateToTile v.x
    }


tileAdd : RowColumn -> Vec -> Vec
tileAdd tile vec =
    { x = vec.x + toFloat tile.column
    , y = vec.y + toFloat tile.row
    }


tileSub : RowColumn -> Vec -> Vec
tileSub tile vec =
    { x = vec.x - toFloat tile.column
    , y = vec.y - toFloat tile.row
    }



-- Collisions


relativeToAbsoluteCollision : Collision geometry -> Collision geometry
relativeToAbsoluteCollision relative =
    { relative
        | impactPoint = tileAdd relative.tile relative.impactPoint
        , aabbPositionAtImpact = tileAdd relative.tile relative.aabbPositionAtImpact
        , fix = tileAdd relative.tile relative.fix
    }



-- Trajectories


absoluteToRelativeTrajectory : RowColumn -> AbsoluteAabbTrajectory -> RelativeAabbTrajectory
absoluteToRelativeTrajectory tile trajectory =
    { relativeStart = tileSub tile trajectory.start
    , relativeEnd = tileSub tile trajectory.end
    , halfWidth = trajectory.width / 2
    , halfHeight = trajectory.height / 2
    }


{-| Sweep

Find all tiles swept by a horizontal segment whose center moves from start to end.

If the AABB is moving right, consider only the tiles swept by the right side of the AABB
...

-}
sweep : AbsoluteAabbTrajectory -> List RowColumn
sweep { start, end, width, height } =
    List.Extra.lift2
        (\x y -> { column = x, row = y })
        (tileRange start.x end.x (width / 2))
        (tileRange start.y end.y (height / 2))


tileRange : Float -> Float -> Float -> List Int
tileRange start end half =
    if start < end then
        List.range
            (coordinateToTile <| start - half)
            (coordinateToTile <| end + half)
    else
        List.range
            (coordinateToTile <| end - half)
            (coordinateToTile <| start + half)



-- Collide


recursiveCollide : (RowColumn -> TileCollider geometry) -> AbsoluteAabbTrajectory -> List (Collision geometry) -> List (Collision geometry)
recursiveCollide getCollider trajectory pairs =
    let
        testCollision : RowColumn -> Maybe (Collision geometry)
        testCollision tile =
            trajectory
                |> absoluteToRelativeTrajectory tile
                |> getCollider tile
                |> Maybe.map (\collision -> { collision | tile = tile })

        maybeCollision : Maybe (Collision geometry)
        maybeCollision =
            sweep trajectory
                |> List.filterMap testCollision
                |> List.Extra.minimumBy .distanceSquared
                |> Maybe.map relativeToAbsoluteCollision
    in
    case maybeCollision of
        Nothing ->
            pairs

        Just collision ->
            if List.length pairs > 10 then
                collision :: pairs
            else
                recursiveCollide
                    getCollider
                    { trajectory
                      --| start = collision.aabbPositionAtImpact
                        | end = collision.fix
                    }
                    (collision :: pairs)


collide : (RowColumn -> TileCollider geometry) -> AbsoluteAabbTrajectory -> List (Collision geometry)
collide getCollider trajectory =
    recursiveCollide getCollider trajectory []


collideOnce : (RowColumn -> TileCollider geometry) -> AbsoluteAabbTrajectory -> Maybe (Collision geometry)
collideOnce getCollider trajectory =
    let
        -- TODO this code duplicates thee one in `recursiveCollide` above.
        testCollision : RowColumn -> Maybe (Collision geometry)
        testCollision tile =
            trajectory
                |> absoluteToRelativeTrajectory tile
                |> getCollider tile
                |> Maybe.map (\collision -> { collision | tile = tile })

        maybeCollision : Maybe (Collision geometry)
        maybeCollision =
            sweep trajectory
                |> List.filterMap testCollision
                |> List.Extra.minimumBy .distanceSquared
                |> Maybe.map relativeToAbsoluteCollision
    in
    maybeCollision



-- Colliders


combine : List (TileCollider a) -> TileCollider a
combine colliders =
    let
        combined : TileCollider a
        combined input =
            colliders
                |> List.filterMap (\collider -> collider input)
                |> List.Extra.minimumBy .distanceSquared
    in
    combined


map : (a -> b) -> TileCollider a -> TileCollider b
map f collider =
    collider >> Maybe.map (collisionMap f identity)


{-| `forwards` and `backwards` can be any two functions that satisfy `forwards >> backwards == identity`
-}
transform : (Vec -> Vec) -> (Vec -> Vec) -> (a -> b) -> TileCollider a -> TileCollider b
transform forwards backwards geo collider =
    let
        transformed : TileCollider b
        transformed input =
            { input
                | relativeStart = forwards input.relativeStart
                , relativeEnd = forwards input.relativeEnd
            }
                |> collider
                |> Maybe.map (collisionMap geo backwards)
    in
    transformed


invertX : TileCollider a -> TileCollider a
invertX =
    transform vecInvertX vecInvertX identity


invertY : TileCollider a -> TileCollider a
invertY =
    transform vecInvertY vecInvertY identity


flipXY : TileCollider a -> TileCollider a
flipXY collider =
    let
        transformed : TileCollider a
        transformed input =
            { input
                | relativeStart = vecFlipXY input.relativeStart
                , relativeEnd = vecFlipXY input.relativeEnd
                , halfWidth = input.halfHeight
                , halfHeight = input.halfWidth
            }
                |> collider
                |> Maybe.map (collisionMap identity vecFlipXY)
    in
    transformed



-- Empty block


collideNever : TileCollider a
collideNever aabbTrajectory =
    Nothing



-- Left to right blocker


makeTrajectory : Vec -> Vec -> Float -> Float
makeTrajectory s e x =
    (x - s.x) * (e.y - s.y) / (e.x - s.x) + s.y


thickCollideWhenXIncreases : TileCollider ()
thickCollideWhenXIncreases =
    collideWhenXIncreases 0.99


{-| bounceBackTheshold:

  - Use 0.99 if you don't want anything to pass through it ever
  - Use 0.2 or smaller for one-way colliders

-}
collideWhenXIncreases : Float -> TileCollider ()
collideWhenXIncreases bounceBackTheshold { relativeStart, relativeEnd, halfWidth, halfHeight } =
    let
        -- The actual X coordinate of the blocker respect to the tile center is -0.5
        blockX =
            -0.5
    in
    if relativeStart.x >= relativeEnd.x then
        -- If movement is not left to right, no point in continuing
        Nothing
    else if relativeStart.x + halfWidth >= blockX + bounceBackTheshold then
        -- The AABB is already past the block, so it should pass
        Nothing
    else if relativeEnd.x + halfWidth <= blockX then
        -- The AABB stops before actually encountering the block
        Nothing
    else
        let
            trajectory =
                makeTrajectory relativeStart relativeEnd

            -- The AABB side that can collide is the right side
            collisionY =
                trajectory (blockX - halfWidth)
        in
        if collisionY + halfHeight <= -0.5 then
            -- Top of the AABB is below the tile at the collision point
            Nothing
        else if collisionY - halfHeight >= 0.5 then
            -- Bottom of the AABB is above the tile at the collision point
            Nothing
        else
            let
                fixedX =
                    blockX - halfWidth - minimumDistance

                point =
                    { x = blockX
                    , y = collisionY
                    }

                aabbPositionAtImpact =
                    { x = fixedX
                    , y = collisionY
                    }
            in
            Just
                { geometry = ()
                , impactPoint = point
                , aabbPositionAtImpact = aabbPositionAtImpact
                , fix = { relativeEnd | x = fixedX } --max relativeStart.x fixedX }
                , distanceSquared = distanceSquared relativeStart aabbPositionAtImpact
                , tile = { row = 0, column = 0 }
                }
