defmodule Backend.Map do

  def new() do %{} end

  def update(node, links, map) do
    Map.put(map, node, links)
  end

  def reachable(node, map) do
    Map.get(map, node, [])
  end

  def all_nodes(map) do
    Enum.flat_map(map, fn { node, reachable } -> [ node | reachable ] end)
  end
end
