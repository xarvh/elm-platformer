module Components exposing (Component, componentNamespace)

import Dict exposing (Dict)
import Player
import Vector exposing (Vector)


type Component
    = Bool_ Bool
    | Int_ Int
    | Float_ Float
    | Vector_ Vector
    | PlayerActionState Player.ActionState


type alias Entity a =
    { a | components : Dict String Component }


float : String -> String -> Float -> { get : Entity a -> Float, set : Float -> Entity a -> Entity a }
float namespace name default =
    let
        key =
            namespace ++ "/" ++ name

        get e =
            case Dict.get key e.components of
                Just (Float_ f) ->
                    f

                _ ->
                    default

        set v e =
            { e | components = Dict.insert key (Float_ v) e.components }
    in
    { get = get
    , set = set
    }


bool : String -> String -> Bool -> { get : Entity a -> Bool, set : Bool -> Entity a -> Entity a }
bool namespace name default =
    let
        key =
            namespace ++ "/" ++ name

        get e =
            case Dict.get key e.components of
                Just (Bool_ f) ->
                    f

                _ ->
                    default

        set v e =
            { e | components = Dict.insert key (Bool_ v) e.components }
    in
    { get = get
    , set = set
    }


int : String -> String -> Int -> { get : Entity a -> Int, set : Int -> Entity a -> Entity a }
int namespace name default =
    let
        key =
            namespace ++ "/" ++ name

        get e =
            case Dict.get key e.components of
                Just (Int_ f) ->
                    f

                _ ->
                    default

        set v e =
            { e | components = Dict.insert key (Int_ v) e.components }
    in
    { get = get
    , set = set
    }


vector : String -> String -> Vector -> { get : Entity a -> Vector, set : Vector -> Entity a -> Entity a }
vector namespace name default =
    let
        key =
            namespace ++ "/" ++ name

        get e =
            case Dict.get key e.components of
                Just (Vector_ f) ->
                    f

                _ ->
                    default

        set v e =
            { e | components = Dict.insert key (Vector_ v) e.components }
    in
    { get = get
    , set = set
    }


playerActionState : String -> String -> Player.ActionState -> { get : Entity a -> Player.ActionState, set : Player.ActionState -> Entity a -> Entity a }
playerActionState namespace name default =
    let
        key =
            namespace ++ "/" ++ name

        get e =
            case Dict.get key e.components of
                Just (PlayerActionState f) ->
                    f

                _ ->
                    default

        set v e =
            { e | components = Dict.insert key (PlayerActionState v) e.components }
    in
    { get = get
    , set = set
    }


componentNamespace namespace =
    { bool = bool namespace
    , int = int namespace
    , float = float namespace
    , vector = vector namespace
    , playerActionState = playerActionState namespace
    }
