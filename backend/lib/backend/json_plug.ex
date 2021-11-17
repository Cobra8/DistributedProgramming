defmodule Plug.JSON do
  @behaviour Plug
  alias Plug.Json

  def init([]), do: []

  def call(conn, []) do
    Plug.Conn.put_resp_content_type(conn, "application/json")
  end

end
