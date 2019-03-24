module Vector exposing (..)


type alias Vector =
    { x : Float
    , y : Float
    }


origin : Vector
origin =
    Vector 0 0


length : Vector -> Float
length v =
    sqrt <| v.x * v.x + v.y * v.y


lengthSquared : Vector -> Float
lengthSquared v =
    v.x * v.x + v.y * v.y


normalize : Vector -> Vector
normalize v =
    if v == origin then
        v
    else
        scale (1 / length v) v


clampToLength : Float -> Vector -> Vector
clampToLength maxLength v =
    let
        ll =
            v.x * v.x + v.y * v.y
    in
    if ll <= maxLength * maxLength then
        v
    else
        let
            m =
                maxLength / sqrt ll
        in
        { x = v.x * m
        , y = v.y * m
        }


clampX : Float -> Vector -> Vector
clampX limit v =
    { v | x = clamp -limit limit v.x }


clampY : Float -> Vector -> Vector
clampY limit v =
    { v | y = clamp -limit limit v.y }


rotateClockwise : Float -> Vector -> Vector
rotateClockwise angle { x, y } =
    let
        sinA =
            sin -angle

        cosA =
            cos angle
    in
    { x = x * cosA - y * sinA
    , y = x * sinA + y * cosA
    }


add : Vector -> Vector -> Vector
add a b =
    { x = a.x + b.x
    , y = a.y + b.y
    }


sub : Vector -> Vector -> Vector
sub a b =
    { x = a.x - b.x
    , y = a.y - b.y
    }


scale : Float -> Vector -> Vector
scale l v =
    { x = v.x * l
    , y = v.y * l
    }


distance : Vector -> Vector -> Float
distance a b =
    let
        dx =
            a.x - b.x

        dy =
            a.y - b.y
    in
    sqrt <| dx * dx + dy * dy


distanceSquared : Vector -> Vector -> Float
distanceSquared a b =
    let
        dx =
            a.x - b.x

        dy =
            a.y - b.y
    in
    dx * dx + dy * dy


mix : Vector -> Vector -> Float -> Vector
mix a b w =
    { x = a.x * w + b.x * (1 - w)
    , y = a.y * w + b.y * (1 - w)
    }
