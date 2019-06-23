

type alias Process =
    { name : String
    , consumed : List { quantity : Int, resource : Resource }
    , nonConsumed : List { quantity : Int, resource : Resource }
    , produced : List { quantity : Int, resource : Resource }
    --
    , duration : Time
    , effort : Effort
    }



resourcePriorityFor character world resource =
  character.knownProcesses
    |> List.filter (\{enjoyment, process} -> processOutputs resource process)
    |> List.map (processPriorityFor character)
    |> List.sum


processPriorityFor character { enjoyment, process } =
  (process.consumed ++ process.nonConsumed)
    |> List.map (\{quantity, resource} -> quantity * resourcePriorityFor character world resource)
    |> List.sum
    |> (*) enjoyment





