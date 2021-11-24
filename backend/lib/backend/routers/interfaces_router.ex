defmodule InterfacesRouter do
  use Plug.Router

  alias Backend.Router, as: Router

  plug :match # order matters, match route first
  plug Plug.CORS # add necessary cors header to allow requests from the frontend
  plug Plug.Parsers, parsers: [:json], json_decoder: Poison # decode json then if matched
  plug Plug.JSON # set the content-type header to json
  plug :dispatch # finally dispatch

  post "/add" do
    case conn.body_params do
      %{ "src_identifier" => src_identifier, "dst_identifier" => dst_identifier, "dst_name" => dst_name } -> 
        case Router.send_message(String.to_atom(src_identifier), { :add, String.to_atom(dst_name), String.to_atom(dst_identifier) }) do # read README for remark about String.to_atom()
          { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Sent message to establish interface from #{src_identifier} outgoing to #{dst_identifier}" }))
          { :error, message } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
        end
      _ -> send_resp(conn, 400, Poison.encode!(%{ error: "Bad post body content" }))
    end
  end

  post "/remove" do
    case conn.body_params do
      %{ "src_identifier" => src_identifier, "dst_name" => dst_name } -> 
        case Router.send_message(String.to_atom(src_identifier), { :remove, String.to_atom(dst_name) }) do
          { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Sent message to remove interface #{dst_name} from #{src_identifier}" }))
          { :error, message } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
        end
      _ -> send_resp(conn, 400, Poison.encode!(%{ error: "Bad post body content" }))
    end
  end

  match _ do
    send_resp(conn, 404, Poison.encode!(%{ error: "404 - Interface endpoint not found!" }))
  end

end
