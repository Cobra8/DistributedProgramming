# filenaming important, mix loads all test files matching test/**/*_test.exs
defmodule DijkstraTest do
  use ExUnit.Case

  alias Backend.Dijkstra, as: Dijkstra

  test "table creation" do
    assert Dijkstra.table([:paris, :madrid], %{madrid: [:berlin], paris: [:rome, :madrid]}) == [berlin: :madrid, rome: :paris, madrid: :madrid, paris: :paris]
  end

  test "berlin route" do
    assert Dijkstra.route(:berlin, Backend.Dijkstra.table([:paris, :madrid], %{madrid: [:berlin], paris: [:rome, :madrid]})) == { :ok, :madrid }
  end

  test "rome route" do
    assert Dijkstra.route(:rome, Backend.Dijkstra.table([:paris, :madrid], %{madrid: [:berlin], paris: [:rome, :madrid]})) == { :ok, :paris }
  end

  test "madrid gateway route" do
    assert Dijkstra.route(:madrid, Backend.Dijkstra.table([:paris, :madrid], %{madrid: [:berlin], paris: [:rome, :madrid]})) == { :ok, :madrid }
  end

  test "notfound route" do
    assert Dijkstra.route(:amsterdam, Backend.Dijkstra.table([:paris, :madrid], %{madrid: [:berlin], paris: [:rome, :madrid]})) == { :notfound }
  end

end
