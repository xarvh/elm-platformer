
- Darkness decreases walk acceleration -> sensazione di pesantezza
- "I'm useless, can't do this"
- "There is no way out"
- player respawn: "-sigh-, I guess I have no choice", "I have to try again", "I can't give up" -> resilenza?

- Pause opens modal menu <-> opening modal menu pauses



- Can't jump down from edge of platforms

- Rewrite collision engine for arbitrary polygons
  * Merge adjacent tiles together
  * Separate one-way platform code from square obstacle code

- Need a Color module and type

- Tree render is spread across too many modules



----------------------------


sante, sojo

https://gooseninja.itch.io/space-music-pack

https://felgo.com/game-resources/16-sites-featuring-free-game-graphics

https://bakudas.itch.io/generic-platformer-pack

https://jonathan-so.itch.io/creatorpack

https://thecrunkenstein.itch.io/roguelike-asset-pack

https://incompetech.filmmusic.io/search/




----------------------------


-- Transform module

module Main exposing (..)


type alias Transform =
    -- The transform is applied in this order: translation, rotation, scale
    { x : Float
    , y : Float
    , z : Int

    --
    , ccw : Float

    --
    , sx : Float
    , sy : Float
    }


identity : Transform
identity =
    { x = 0
    , y = 0
    , z = 0
    , ccw = 0
    , sx = 1
    , sy = 1
    }



inverse : Transform -> Transform
inverse t =
    { x = 0
    , y = 0
    , z = -t.z
    , ccw = -t.ccw
    , sx = 1
    , sy = 1
    }




mul : Transform -> Transform -> Transform
mul a b =
    let
        sinA =
            sin a.ccw

        cosA =
            cos a.ccw

        ssx =
            b.sx * cosA - b.sy * sinA

        ssy =
            b.sx * sinA + b.sy * cosA

        bbx =
            a.sx * b.x

        bby =
            a.sy * b.y

        x =
            bbx * cosA - bby * sinA

        y =
            bbx * sinA + bby * cosA
    in
    { x = a.x + x
    , y = a.y + y
    , z = a.z + b.z

    --
    , ccw = a.ccw + b.ccw

    --
    , sx = a.sx * ssx
    , sy = a.sy * ssy
    }
