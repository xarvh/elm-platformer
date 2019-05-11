port module Ports exposing (..)


port saveAs : { name : String, mime : String, content : String } -> Cmd msg


port saveMap : String -> Cmd msg
