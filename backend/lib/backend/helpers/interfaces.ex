defmodule Backend.Interfaces do

  def new() do [] end

  def add(name, ref, pid, interfaces) do
    [ { name, ref, pid } | interfaces ]
  end

  def remove(name, interfaces) do
    List.keydelete(interfaces, name, 0) # delete entry where element at pos 0 in tuple is name
  end

  def ref(name, interfaces) do
    { _, ref, _ } = List.keyfind(interfaces, name, 0, { :notfound, :notfound, :notfound })
    if ref == :notfound do { :notfound } else { :ok, ref } end
  end

  def pid(name, interfaces) do
    { _, _, pid } = List.keyfind(interfaces, name, 0, { :notfound, :notfound, :notfound })
    if pid == :notfound do { :notfound } else { :ok, pid } end
  end

  def name(ref, interfaces) do
    { name, _, _ } = List.keyfind(interfaces, ref, 1, { :notfound, :notfound, :notfound })
    if name == :notfound do { :notfound } else { :ok, name } end
  end

  def list(interfaces) do
    Enum.map(interfaces, fn { name, _, _ } -> name end)
  end

  def broadcast(message, interfaces) do
    Enum.each(interfaces, fn { _, _, pid } -> send(pid, message) end)
  end

end

# defmodule Backend.Interfaces do

#   def new() do %{} end

#   def add(name, ref, pid, interfaces) do
#     Map.put(interfaces, name, { ref, pid })
#   end

#   def remove(name, interfaces) do
#     Map.delete(interfaces, name)
#   end

#   def ref(name, interfaces) do
#     { ref, _ } = Map.get(interfaces, name, { :notfound, :notfound })
#     if ref == :notfound do { :notfound } else { :ok, ref } end
#   end

#   def ref(name, interfaces) do
#     { _, pid } = Map.get(interfaces, name, { :notfound, :notfound })
#     if pid == :notfound do { :notfound } else { :ok, pid } end
#   end

#   def name(ref, interfaces) do # suboptimal to use a map if we use this often, should switch to a list then
#     { name, _ } = Enum.find(interfaces, fn (_, { candidate, _ }) -> ref == candidate end)
#     if name == :notfound do { :notfound } else { :ok, name } end
#   end

#   def list(interfaces) do

#   end

#   def broadcast(message, interfaces) do
#   end

# end