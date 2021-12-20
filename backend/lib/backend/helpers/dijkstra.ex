defmodule Backend.Dijkstra do
  alias Backend.Map, as: Map # reference the real map module with Elixir.Map

  defp update(node, gateway, n, sorted) do
    { _, _, current } = List.keyfind(sorted, node, 0, { 0, 0, 0 }) # find tuple where key at 0 matches node => List.keyfind(list, key, pos, default)
    if n <= current do
      List.keysort(List.keyreplace(sorted, node, 0, { node, gateway, n }), 2) # replace key at pos 0 (node name) if existing and sort by key at pos 2 (hop length)
    else sorted end
  end

  defp iterate([], _, table) do Enum.reverse(table) end
  defp iterate([ { _, _, :inf } | _ ], _, table) do Enum.reverse(table) end
  defp iterate([ { node, gateway, length } | rest ], map, table) do
    reachable = Map.reachable(node, map)
    new_rest = List.foldl(reachable, rest, fn (neighbour, acc) -> update(neighbour, gateway, length + 1, acc) end)

    iterate(new_rest, map, [ { node, gateway } | table])
  end
  
  def table(gateways, map) do # create routing table from gateways and the map
    initial_gateways = Enum.map(gateways, fn (gateway) -> { gateway, gateway, 1 } end) 
    initial_map = Enum.map(Map.all_nodes(map), fn (node) -> { node, :unknown, :inf } end)

    sorted = List.keysort(initial_gateways ++ initial_map, 2) # could eliminate unusable junk from map here with Enum.uniq_by since list is sorted and uniq keeps the first element (but not necessary since we stop iterate on the first hit of a length of :inf)
    iterate(sorted, map, []) # result is wrong in the sense that the entry for the executing node is not { :node, :node, 0 } instead some random entry => this does not matter since when routing a message and being on the destination we do not ask the dijkstra module ^^
  end

  def route(node, table) do # find to which node to route for node
    { _, target } = List.keyfind(table, node, 0, { node, :notfound })
    if target == :notfound do { :notfound } else { :ok, target } end
  end

end
