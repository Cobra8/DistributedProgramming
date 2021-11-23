defmodule Backend.Router do
  alias Backend.Interfaces, as: Interfaces
  alias Backend.Map, as: Map # reference the real map module with Elixir.Map
  alias Backend.Dijkstra, as: Dijkstra
  alias Backend.History, as: History

  def start(identifier, name) do
    Registry.register(Registry.UniqueRegisterTest, identifier, spawn(fn -> initialize(name) end))
  end

  def stop(identifier) do
    send(identifier, :stop)
    Registry.unregister(Registry.UniqueRegisterTest, identifier)
  end

  defp initialize(name) do
    interfaces = Interfaces.new()
    map = Map.new()
    table = Dijkstra.table(interfaces, map)
    history = History.new(name)

    router(name, interfaces, map, table, history, 0)
  end

  defp router(name, interfaces, map, table, history, counter) do
    :ok
  end

end