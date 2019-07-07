module Valley exposing (..)


type alias World =
    { people : List Person
    , terrain : Terrain

    -- Storage
    , strawberries : Int
    , seeds : Int
    , wood : Int
    , spades : Int

    --
    -- TODO something about forageable strawberries?
    }


type Duration
    = Instant
    | OneHour
    | OneDay


type Requirement
    = Consume Int Item
    | Use Item
    | FromTerrain Terrain


type Product
    = Satisfy Int Need
    | Produce Int Item
    | ToTerrain Terrain


type Need
    = Hunger


type Item
    = Strawberry
    | Seeds
    | Wood
    | Spade


type Terrain
    = Raw
    | Tilled
    | Seeded
    | Growing
    | Mature


type Skill
    = Foraging
    | Cultivating


type alias ProcessAndEnjoyment =
    ( Process, Enjoyment )


type alias Person =
    { name : String
    , knownProcesses : List ProcessAndEnjoyment
    }


{-| Rename to `Action`?
-}
type alias Process =
    { name : String
    , requirements : List Requirement
    , products : List Product

    --
    , enjoymentBias : Enjoyment
    , duration : Duration
    , effort : Effort
    , requiredSkills : List Skill
    }


type Enjoyment
    = Enjoyable
    | Meh
    | Unenjoyable


type Effort
    = Intense
    | Light
    | Negligible



--


getStorage : World -> Item -> Int
getStorage world item =
    case item of
        Strawberry ->
            world.strawberries

        Seeds ->
            world.seeds

        Wood ->
            world.wood

        Spade ->
            world.spades


enjoymentToFloat : Enjoyment -> Float
enjoymentToFloat enjoyment =
    case enjoyment of
        Enjoyable ->
            1

        Meh ->
            0

        Unenjoyable ->
            -1


enjoymentBias : Process -> Enjoyment -> Float
enjoymentBias process enjoyment =
    0.6 * enjoymentToFloat enjoyment + 0.4 * enjoymentToFloat process.enjoymentBias



--


productEquality : Product -> Product -> Bool
productEquality a b =
    case ( a, b ) of
        ( Satisfy _ aNeed, Satisfy _ bNeed ) ->
            aNeed == bNeed

        ( Produce _ aItem, Produce _ bItem ) ->
            aItem == bItem

        _ ->
            a == b


productPriority : World -> List ProcessAndEnjoyment -> Product -> Float
productPriority world knownProcesses resource =
    knownProcesses
        |> List.filter (\( process, enjoyment ) -> List.any (productEquality resource) process.products)
        |> List.map (\( process, enjoyment ) -> enjoymentBias process enjoyment * processPriority world knownProcesses process)
        |> List.sum


processPriority : World -> List ProcessAndEnjoyment -> Process -> Float
processPriority world allProcesses process =
    let
        -- Prevent infinite recursion
        availableProcesses =
            List.filter (\( p, e ) -> p /= process) allProcesses
    in
    process.requirements
        |> List.map (requirementPriority world availableProcesses)
        |> List.sum


requirementPriority : World -> List ProcessAndEnjoyment -> Requirement -> Float
requirementPriority world knownProcesses requirement =
    case requirement of
        Consume n item ->
            let
                t =
                    n - getStorage world item
            in
            toFloat t * productPriority world knownProcesses (Produce 1 item)

        Use item ->
            productPriority world knownProcesses (Produce 1 item)

        FromTerrain terrain ->
            if world.terrain == terrain then
                0
            else
                productPriority world knownProcesses (ToTerrain terrain)



--


eatable : Int -> Item -> Process
eatable satisfaction item =
    { name = "Eat " ++ Debug.toString item
    , requirements =
        [ Consume 1 item
        ]
    , products =
        [ Satisfy satisfaction Hunger
        ]

    --
    , enjoymentBias = Enjoyable
    , duration = Instant
    , effort = Negligible
    , requiredSkills = []
    }


testProcesses : List Process
testProcesses =
    [ eatable
        1
        Strawberry
    , eatable
        4
        Seeds

    --
    , { name = "Make Spade"
      , requirements =
            [ Consume 1 Wood
            ]
      , products =
            [ Produce 1 Spade
            ]

      --
      , enjoymentBias = Meh
      , duration = OneHour
      , effort = Light
      , requiredSkills = []
      }
    , { name = "Till"
      , requirements =
            [ FromTerrain Tilled
            , Use Spade
            ]
      , products =
            [ ToTerrain Tilled
            ]

      --
      , enjoymentBias = Meh
      , duration = OneHour
      , effort = Intense
      , requiredSkills = []
      }
    , { name = "Sow"
      , requirements =
            [ Consume 1 Seeds
            , FromTerrain Tilled
            ]
      , products =
            [ ToTerrain Seeded
            ]

      --
      , enjoymentBias = Meh
      , duration = OneHour
      , effort = Light
      , requiredSkills = []
      }
    , { name = "Water"
      , requirements =
            [ FromTerrain Seeded
            ]
      , products =
            [ ToTerrain Growing
            ]

      --
      , enjoymentBias = Meh
      , duration = OneDay
      , effort = Intense
      , requiredSkills = []
      }
    , { name = "Water"
      , requirements =
            [ FromTerrain Seeded
            ]
      , products =
            [ ToTerrain Growing
            ]

      --
      , enjoymentBias = Meh
      , duration = OneDay
      , effort = Intense
      , requiredSkills = []
      }
    ]



--- test


testPerson : Person
testPerson =
    { name = "test person"
    , knownProcesses = testProcesses |> List.map (\p -> ( p, Meh ))
    }


testWorld : World
testWorld =
    { people = [ testPerson ]
    , terrain = Raw
    , strawberries = 0
    , seeds = 0
    , wood = 0
    , spades = 0
    }


all =
    List.map show testProcesses


show process =
    let
        s =
            processPriority testWorld testPerson.knownProcesses process
    in
    Debug.log process.name s
