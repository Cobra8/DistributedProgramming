defmodule TopLevelRouter do
  use Plug.Router

  plug :match # tell plug to match route first, then dispatch to relevant routers
  plug :dispatch

  get "/" do
    send_resp(conn, 200, "Welcome to our Elixir project for our university course \"Concurrent and distributed programming\"")
  end

  forward "/json", to: JsonRouter

  match _ do
    send_resp(conn, 404, "404 - Page not found!")
  end
end
