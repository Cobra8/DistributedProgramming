# filenaming important, mix loads all test files matching test/**/*_test.exs
defmodule RouterTest do
  use ExUnit.Case

  alias Backend.Router, as: Router

  test "router connection, interface creation and fail scenario" do
    Router.start(:first_router, :berlin)
    Router.start(:second_router, :madrid)

    send(:first_router, { :add, :madrid, :second_router })

    pid = spawn(fn -> test() end)

    send(:first_router, { :status, pid }) # should contain the interface sent before
    send(:second_router, { :status, pid }) # should be empty

    send(:second_router, :stop)
    :timer.sleep(500)

    send(:first_router, { :status, pid }) # interface for :berline should automatically be empty

    :timer.sleep(1000) 
    # currently this test passes anyways, interesting would be how to test / assert reponses?
  end

  test "router broadcast links" do
    Router.start(:third_router, :berlin)
    Router.start(:fourth_router, :madrid)

    send(:third_router, { :add, :madrid, :fourth_router })
    send(:third_router, { :broadcast })

    pid = spawn(fn -> test() end)
    :timer.sleep(200)

    send(:third_router, { :status, pid }) # should contain the sent interface and links
    send(:fourth_router, { :status, pid }) # should receive links from :first_router and therefore have an updated map

    :timer.sleep(1000)
    # currently this test passes anyways, interesting would be how to test / assert reponses?
  end

  test "router update table" do
    Router.start(:fifth_router, :berlin)
    Router.start(:sixth_router, :madrid)

    send(:fifth_router, { :add, :madrid, :sixth_router })
    send(:sixth_router, { :add, :berlin, :fifth_router })
    send(:fifth_router, { :broadcast })

    :timer.sleep(200)

    send(:sixth_router, { :update })

    pid = spawn(fn -> test() end)
    :timer.sleep(200)

    send(:fifth_router, { :status, pid }) # should have an entry in it's table that routes a packet 
    send(:sixth_router, { :status, pid }) # should have an entry in it's table that routes a packet 

    :timer.sleep(1000)
    # currently this test passes anyways, interesting would be how to test / assert reponses?
  end

  test "router circle" do
    Router.start(:router_a, :berlin)
    Router.start(:router_b, :madrid)
    Router.start(:router_c, :amsterdam)

    send(:router_a, { :add, :madrid, :router_b })
    send(:router_b, { :add, :amsterdam, :router_c })
    send(:router_c, { :add, :berlin, :router_a })
    
    Enum.each([ :router_a, :router_b, :router_c ], fn router -> send(router, { :broadcast }) end)

    :timer.sleep(500)

    Enum.each([ :router_a, :router_b, :router_c ], fn router -> send(router, { :update }) end)

    pid = spawn(fn -> test() end)
    :timer.sleep(500)

    Enum.each([ :router_a, :router_b, :router_c ], fn router -> send(router, { :status, pid }) end)

    :timer.sleep(500)
    # currently this test passes anyways, interesting would be how to test / assert reponses?
  end

  test "routing messages" do
    Router.start(:router_berlin, :berlin)
    Router.start(:router_madrid, :madrid)
    Router.start(:router_amsterdam, :amsterdam)

    send(:router_berlin, { :add, :madrid, :router_madrid })
    send(:router_madrid, { :add, :amsterdam, :router_amsterdam })
    send(:router_amsterdam, { :add, :berlin, :router_berlin })
    
    Enum.each([ :router_berlin, :router_madrid, :router_amsterdam ], fn router -> send(router, { :broadcast }) end)

    :timer.sleep(500)

    Enum.each([ :router_berlin, :router_madrid, :router_amsterdam ], fn router -> send(router, { :update }) end)

    send(:router_berlin, { :route, :amsterdam, :berlin, "first hello" })
    send(:router_madrid, { :route, :amsterdam, :madrid, "second hello" })
    send(:router_amsterdam, { :route, :amsterdam, :amsterdam, "hello from home" })
    send(:router_madrid, { :route, :berlin, :madrid, "hello to germany!" })

    :timer.sleep(500)
    # currently this test passes anyways, interesting would be how to test / assert reponses?
  end

  
  defp test() do
    receive do
      { :status, { name, interfaces, map, table, history, counter } } -> 
        # IO.inspect { name, interfaces, map, table, history, counter }
        IO.inspect { name, interfaces, map, table, history, counter }
        test()
    end
  end

end
