# filenaming important, mix loads all test files matching test/**/*_test.exs
defmodule HistoryTest do
  use ExUnit.Case

  alias Backend.History, as: History

  test "history creation" do
    assert History.new(:london) == %{london: :inf}
  end

  test "history new node" do
    assert History.update(:berlin, 5, History.new(:london)) == {:new, %{berlin: 5, london: :inf}}
  end

  test "history older message" do
    assert History.update(:berlin, 3, %{berlin: 5, london: :inf}) == {:old}
  end

  test "history newer message" do
    assert History.update(:berlin, 7, %{berlin: 5, london: :inf}) ==  {:new, %{berlin: 7, london: :inf}}
  end
end
