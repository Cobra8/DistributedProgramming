defmodule MessagesRouter do
  use Plug.Router

  alias Backend.Router, as: Router

  plug :match # order matters, match route first
  plug Plug.CORS # add necessary cors header to allow requests from the frontend
  plug Plug.Parsers, parsers: [:json], json_decoder: Poison # decode json then if matched
  plug Plug.JSON # set the content-type header to json
  plug :dispatch # finally dispatch

  post "/send" do
    case conn.body_params do
      %{ "src_identifier" => src_identifier, "dst_name" => dst_name, "message" => message } -> 
        case Router.send_message(String.to_atom(src_identifier), { :send, String.to_atom(dst_name), message }) do # read README for remark about String.to_atom()
          { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Sent message to initiate routing from #{src_identifier} with destination #{dst_name}" }))
          { :error, message } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
        end
      _ -> send_resp(conn, 400, Poison.encode!(%{ error: "Bad post body content" }))
    end
  end

  match _ do
    send_resp(conn, 404, Poison.encode!(%{ error: "404 - Message endpoint not found!" }))
  end

end
