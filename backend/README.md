# Backend

## Compilation

`mix` to compile the Elixir files

## Running the backend

`export BACKEND_PORT=8081`  
`export FRONTEND_HOST=http://localhost:8080`  
`iex -S mix` to run the compiled files in an interactive Elixir shell

## Unit tests

`mix test` to run all test  
`mix test test/**/*_test.exs` to run a specific test file

### Vulnerable towards DoS attacks

Extensive use of String.to_atom() with unsafe user input making code vulnerable to simple DoS attacks

## Docs

https://hexdocs.pm/elixir/1.12/Application.html  
https://hexdocs.pm/elixir/1.12/IO.html  
https://hexdocs.pm/elixir/1.12/List.html  
https://hexdocs.pm/elixir/1.12/Map.html  
https://hexdocs.pm/elixir/1.12/Enum.html  
https://hexdocs.pm/elixir/1.12/Process.html  
https://hexdocs.pm/elixir/1.12/Registry.html
