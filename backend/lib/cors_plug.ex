defmodule Plug.CORS do
  @behaviour Plug

  def init([]), do: []

  def call(conn, []) do
    Plug.Conn.put_resp_header(conn, "Access-Control-Allow-Origin", Application.get_env(:backend, :frontend_host, "http://localhost:8080"))
  end

end
