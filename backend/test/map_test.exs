# filenaming important, mix loads all test files matching test/**/*_test.exs
defmodule MapTest do
  use ExUnit.Case

  alias Backend.Map, as: Map # reference the real map module with Elixir.Map

  test "map creation" do
    assert Map.new() == %{}
  end

  test "map update" do
    assert Map.update(:berlin, [:london, :paris], %{}) == %{berlin: [:london, :paris]}
  end

  test "map reachable for existing" do
    assert Map.reachable(:berlin, %{berlin: [:london, :paris]}) == [:london, :paris]
  end

  test "map reachable for non-existing" do
    assert Map.reachable(:london, %{berlin: [:london, :paris]}) == []
  end

  test "all nodes" do
    assert Map.all_nodes(%{berlin: [:london, :paris]}) == [:berlin, :london, :paris]
  end
end
