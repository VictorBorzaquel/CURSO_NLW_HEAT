defmodule MicroserviceWeb.MessagesController do
  use MicroserviceWeb, :controller

  def create(conn, params) do
  IO.inspect(params)

  conn
  |> text("RECEBI A REQUISIÇÃO")
  end
end
