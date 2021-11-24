defmodule Backend.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: TopLevelRouter, options: [port: Application.get_env(:backend, :port, 8081)]}
    ]

    options = [strategy: :one_for_one, name: Backend.Supervisor]
    Supervisor.start_link(children, options)
  end


  @impl true
  def stop(_) do
    Plug.Cowboy.shutdown TopLevelRouter.HTTP
  end
end
