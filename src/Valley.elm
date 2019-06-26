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


type Effort
    = Intense
    | Light
    | Negligible



--


resourcePriority : Person -> Item -> Float
resourcePriority character resource =
    character.knownProcesses
        |> List.filter (\{ enjoyment, process } -> processOutputs resource process)
        |> List.map (\{ enjoyment, process } -> enjoyment * processPriority character process)
        |> List.sum


processPriority : Person -> Process -> Float
processPriority character process =
    process.requirements
        |> List.map (\{ qty, resource } -> qty * resourcePriority character resource)
        |> List.sum



--


eatable : Int -> Item -> Process
eatable satisfaction item =
    { name = "Eat " ++ thingToName item
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
