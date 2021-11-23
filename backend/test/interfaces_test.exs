# filenaming important, mix loads all test files matching test/**/*_test.exs
defmodule InterfacesTest do
  use ExUnit.Case

  alias Backend.Interfaces, as: Interfaces

  test "interfaces creation" do
    assert Interfaces.new() == []
  end

  test "interfaces add interface" do
    assert Interfaces.add(:berlin, :proc_ref, :pid, Interfaces.new()) == [ { :berlin, :proc_ref, :pid } ]
  end

  test "interfaces remove interface" do
    assert Interfaces.remove(:berlin, [ { :berlin, :proc_ref, :pid } ]) == []
  end

  test "interfaces existing ref" do
    assert Interfaces.ref(:berlin, [ { :berlin, :proc_ref, :pid } ]) == { :ok, :proc_ref }
  end

  test "interfaces non-existing ref" do
    assert Interfaces.ref(:amsterdam, [ { :berlin, :proc_ref, :pid } ]) == { :notfound }
  end

  test "interfaces existing pid" do
    assert Interfaces.pid(:berlin, [ { :berlin, :proc_ref, :pid } ]) == { :ok, :pid }
  end

  test "interfaces non-existing pid" do
    assert Interfaces.pid(:amsterdam, [ { :berlin, :proc_ref, :pid } ]) == { :notfound }
  end

  test "interfaces existing name" do
    assert Interfaces.name(:proc_ref, [ { :berlin, :proc_ref, :pid } ]) == { :ok, :berlin }
  end

  test "interfaces non-existing name" do
    assert Interfaces.name(:amsterdam, [ { :berlin, :proc_ref, :pid } ]) == { :notfound }
  end

  test "interfaces list" do
    assert Interfaces.list([ { :berlin, :proc_ref, :pid }, {:amsterdam, :porc_ref, :pid } ]) == [:berlin, :amsterdam]
  end

  test "interfaces broadcast" do
    assert Interfaces.broadcast("hello", [ { :berlin, :proc_ref, self() }, {:amsterdam, :porc_ref, self() } ]) == :ok
  end

end
