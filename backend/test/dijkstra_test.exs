# filenaming important, mix loads all test files matching test/**/*_test.exs
defmodule DijkstraTest do
  use ExUnit.Case

  alias Backend.Dijkstra, as: Dijkstra

  test "table creation" do
    assert Dijkstra.table([:paris, :madrid], %{madrid: [:berlin], paris: [:rome, :madrid]}) == [paris: :paris, madrid: :madrid, rome: :paris, berlin: :madrid]
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

  test "triangle table" do
    assert Dijkstra.table([:sidney, :london], %{oslo: [:sidney, :london], sidney: [:london]}) == [sidney: :sidney, london: :london]
    assert Dijkstra.table([:london, :sidney], %{oslo: [:sidney, :london], sidney: [:london]}) == [london: :london, sidney: :sidney, london: :sidney]
  end
end
