defmodule Backend.Router do
  alias Backend.Interfaces, as: Interfaces
  alias Backend.Map, as: Map # reference the real map module with Elixir.Map
  alias Backend.Dijkstra, as: Dijkstra
  alias Backend.History, as: History

  def start(identifier, name) do
    try do
      Process.register(spawn(fn -> initialize(name) end), identifier); { :ok }
    rescue ex in ArgumentError -> { :error,  ex.message } end
  end

  def stop(identifier) do
    try do
      send(identifier, :stop)
      Process.unregister(identifier); { :ok }
    rescue ex in ArgumentError -> { :error, ex.message } end
  end

  defp initialize(name) do
    interfaces = Interfaces.new()
    map = Map.new()
    table = Dijkstra.table(interfaces, map)
    history = History.new(name)

    router(name, interfaces, map, table, history, 1)
  end

  def send_message(pid, message) do
    try do
      send(pid, message); { :ok }
    rescue ex in ArgumentError -> { :error, ex.message } end
  end
  
  def retrieve_status(pid, from \\ self()) do
    send_message(pid, { :status, from })
  end

  defp router(name, interfaces, map, table, history, counter) do
    receive do
      ###################### Interface messages ######################

      { :add, interface, pid } ->
        ref = Process.monitor(pid)
        new_interfaces = Interfaces.add(interface, ref, pid, interfaces)
        router(name, new_interfaces, map, table, history, counter)
      
      { :remove, interface } ->
        { :ok, ref } = Interfaces.ref(interface, interfaces) 
        Process.demonitor(ref)
        new_interfaces = Interfaces.remove(interface, interfaces)
        router(name, new_interfaces, map, table, history, counter)

      { :DOWN, ref, :process, _, _ } -> # sent to all processes that called monitor on the PID of a process when it goes down ({:DOWN, ref, :process, pid, :noproc})
        { :ok, down } = Interfaces.name(ref, interfaces)
        IO.puts("#{name}: monitor sent exit from #{down}, removing interface.")
        new_interfaces = Interfaces.remove(down, interfaces)
        router(name, new_interfaces, map, table, history, counter)

      ###################### Link-State messages ######################
      { :links, node, links, count } ->
        case History.update(node, count, history) do
          { :new, new_history } ->
            Interfaces.broadcast({ :links, node, links, count }, interfaces)
            new_map = Map.update(node, links, map)
            router(name, interfaces, new_map, table, new_history, counter)

          { :old } ->
            router(name, interfaces, map, table, history, counter)
        end

      { :broadcast } -> # for now need to manually send message to broadcast links (should do this periodically)
        Interfaces.broadcast({ :links, name, Interfaces.list(interfaces), counter }, interfaces)
        router(name, interfaces, map, table, history, counter + 1)

      { :update } -> # for now need to manually send message to update routing table (should do this when we receiving a link-state message or every time the map changes)
        new_table = Dijkstra.table(Interfaces.list(interfaces), map)
        router(name, interfaces, map, new_table, history, counter)

      ###################### Routing messages ######################
      { :route, ^name, from, message } -> # message arrived at destination (using ^ pin operator to pattern match on name!)
        IO.puts("#{name}: received message \"#{message}\" from #{from}")
        router(name, interfaces, map, table, history, counter)
      
      { :route, to, from, message } ->
        case Dijkstra.route(to, table) do
          { :ok, gateway } -> 
            case Interfaces.pid(gateway, interfaces) do
              { :ok, pid } -> 
                IO.puts("#{name}: routing message \"#{message}\" with destination #{to} to next hop #{gateway} (initial sender is #{from})")
                send(pid, { :route, to, from, message })
              { :notfound } -> :ok
            end
          { :notfound } -> :ok
        end
        router(name, interfaces, map, table, history, counter)

      { :send, to, message } ->
        send(self(), { :route, to, name, message })
        router(name, interfaces, map, table, history, counter)
      
      ###################### Other messages ######################
      { :status, from } ->
        simple_interfaces = Enum.map(interfaces, fn { name, _, pid } -> %{ name: name, identifier: pid } end)
        simple_table = Enum.map(table, fn { target, gateway } -> %{ target: target, gateway: gateway } end)
        send(from, { :status, { name, simple_interfaces, map, simple_table, history, counter } })

        router(name, interfaces, map, table, history, counter)

      :stop -> :ok 
    end
  end

end