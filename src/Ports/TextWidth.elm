port module Ports.TextWidth exposing (..)


port textWidthRequest : Int -> Cmd msg


port textWidthResponse : (( Int, Float ) -> msg) -> Sub msg
