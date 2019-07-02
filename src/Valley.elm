module Main exposing (..)


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


type alias Person =
    { name : String
    , knownProcesses : List { enjoyment : Enjoyment, process : Process }
    }


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


type Effort
    = Intense
    | Light
    | Negligible



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


productPriority : Person -> Product -> Float
productPriority person resource =
    person.knownProcesses
        |> List.filter (\{ enjoyment, process } -> List.any (productEquality resource) process.products)
        |> List.map (\{ enjoyment, process } -> enjoymentBias process enjoyment * processPriority person process)
        |> List.sum


processPriority : Person -> Process -> Float
processPriority person process =
    process.requirements
        |> List.map (requirementPriority person)
        |> List.sum


requirementPriority : Person -> Requirement -> Float
requirementPriority person requirement =
    case requirement of
        Consume n item ->
            toFloat n * productPriority person (Produce 1 item)

        Use item ->
            productPriority person (Produce 1 item)

        FromTerrain terrain ->
            productPriority person (ToTerrain terrain)



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


processes : List Process
processes =
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
