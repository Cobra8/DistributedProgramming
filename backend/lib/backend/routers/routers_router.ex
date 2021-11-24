defmodule RoutersRouter do
  use Plug.Router

  alias Backend.Router, as: Router

  plug :match # order matters, match route first
  plug Plug.CORS # add necessary cors header to allow requests from the frontend
  plug Plug.Parsers, parsers: [:json], json_decoder: Poison # decode json then if matched
  plug Plug.JSON # set the content-type header to json
  plug :dispatch # finally dispatch

  post "/start" do
    case conn.body_params do
      %{ "identifier" => identifier, "name" => name } -> 
        case Router.start(String.to_atom(identifier), String.to_atom(name)) do # read README for remark about String.to_atom()
          { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Started router with identifier #{identifier}" }))
          { :error, message } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
        end
      _ -> send_resp(conn, 400, Poison.encode!(%{ error: "Bad post body content" }))
    end
  end

  post "/stop" do
    case conn.body_params do
      %{ "identifier" => identifier } -> 
        case Router.stop(String.to_atom(identifier)) do
          { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Stopped router with identifier #{identifier}" }))
          { :error, message  } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
        end
      _ -> send_resp(conn, 400, Poison.encode!(%{ error: "Bad post body content" }))
    end
  end

  get "/broadcast/:target" do
    case Router.send_message(String.to_atom(target), { :broadcast }) do
      { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Sent message to initiate broadcast on #{target}" }))
      { :error, message } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
    end
  end

  get "/update/:target" do
    case Router.send_message(String.to_atom(target), { :update }) do
      { :ok } -> send_resp(conn, 200, Poison.encode!(%{ success: "Sent message to initiate update on #{target}" }))
      { :error, message } -> send_resp(conn, 400, Poison.encode!(%{ error: message }))
    end
  end

  get "/status/:target" do
    req_task = Task.async(fn -> # spawns a new proccess
      case Router.retrieve_status(String.to_atom(target), self()) do # sends status request
        { :ok } ->
          receive do # wait for response (which the target sends back to from which in this case is self())
            { :status, { name, interfaces, map, table, history, counter } } -> 
              { 200, %{ name: name, interfaces: interfaces, map: map, table: table, history: history, counter: counter } }
          end

        { :error, _ } -> { :error } # let await handle the error
      end
    end)

    case Task.await(req_task, 3000) do # timeout of 3 seconds, crashes this calling process when exceeded
      { status_code, result } -> send_resp(conn, status_code, Poison.encode!(result))
      _ -> send_resp(conn, 400, Poison.encode!(%{ error: "Bad target, does the target identifier exist?" }))
    end   
  end

  match _ do
    send_resp(conn, 404, Poison.encode!(%{ error: "404 - Router endpoint not found!" }))
  end

end
