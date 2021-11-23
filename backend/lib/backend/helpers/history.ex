defmodule Backend.History do

  def new(name) do Map.put(%{}, name, :inf) end

  def update(node, n, history)  do
    current = Map.get(history, node, 0)
    if n > current do { :new, Map.put(history, node, n) } else { :old } end
  end

end