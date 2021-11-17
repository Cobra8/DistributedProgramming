defmodule JsonRouter do
  use Plug.Router

  plug :match
  plug Plug.Parsers, parsers: [:json], json_decoder: Poison # order matters, match route first, decode json then if matched, finally dispatch
  plug Plug.CORS # adds the necessary cors header to allow requests from the frontend
  plug Plug.JSON # sets the content-type header
  plug :dispatch

  get "/ping" do
    conn
      |> send_resp(200, Poison.encode!(%{message: "pong!"}))
  end

  get "/welcome/:name" do
    conn
      |> send_resp(200, Poison.encode!(%{message: "Welcome #{name}!"}))
  end

  match _ do
    send_resp(conn, 404, "404 - JSON endpoint not found!")
  end

end
