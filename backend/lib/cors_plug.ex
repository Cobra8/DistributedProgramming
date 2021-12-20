##########################################
#
# Extremely simplified CORS plug, inspired by https://github.com/mschae/cors_plug
# If better / finer control is needed, use either CORS_Plug or Corsica library
#
##########################################
defmodule Plug.CORS do
  @behaviour Plug
  import Plug.Conn

  def defaults do
    [
      origin: Application.get_env(:backend, :frontend_host, "http://localhost:8080"),
      credentials: true,
      headers: [
        "Authorization",
        "Accept",
        "Content-Type",
        "Referer",
        "Origin",
        "User-Agent",
        "Cache-Control",
        "Keep-Alive",
      ],
      methods: [ "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ],
      send_preflight_response?: true
    ]
  end

  def init(options) do
    defaults()
      |> Keyword.merge(options)
      |> Keyword.update!(:methods, &Enum.join(&1, ",")) # & capture function (captures the function and makes it usable as an anonymous function argument)
  end

  def call(conn, options) do
    conn = merge_resp_headers(conn, headers(conn, options)) # Plug.Conn.merge_resp_headers(conn, headers)

    case { options[:send_preflight_response?], conn.method } do
      { true, "OPTIONS" } -> conn |> send_resp(204, "") |> halt() # immediately respond with empty body to cors preflight request and halt connection to not forward down to other plug's
      { _, _ } -> conn
    end
  end


  defp headers(conn = %Plug.Conn{method: "OPTIONS"}, options) do # headers specific to OPTIONS request
    headers(%{conn | method: nil}, options) ++ [
      { "access-control-allow-headers", Enum.join(options[:headers], ",") } ,
      { "access-control-allow-methods", options[:methods] }
    ]
  end

  defp headers(_, options) do # unviversal headers for all requests
    [
      { "access-control-allow-origin", options[:origin] },
      { "access-control-allow-credentials", "#{options[:credentials]}" }
    ]
  end


end
