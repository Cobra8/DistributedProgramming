# Backend

## Compilation

### For developement

`mix deps.get` to install the necessary dependencies  
`mix` to compile the Elixir files

### For production

`MIX_ENV=prod mix` to compile the Elixir files in production mode

## Running the backend

`export BACKEND_PORT=8081`  
`export FRONTEND_HOST=http://localhost:8080`

### For developement

`iex -S mix` to run the compiled files in an interactive Elixir shell

### For production

`MIX_ENV=prod iex -S mix` to run the compiled files in an interactive Elixir shell

## Unit tests

`mix test` to run all test  
`mix test test/**/*_test.exs` to run a specific test file

## Vulnerable against DoS attacks

The backend makes extensive use of String.to_atom() with unsafe user input making the code vulnerable to simple DoS attacks directly through the frontend or through all other sorts of requests!

## Docs

https://hexdocs.pm/elixir/1.12/Application.html  
https://hexdocs.pm/elixir/1.12/IO.html  
https://hexdocs.pm/elixir/1.12/List.html  
https://hexdocs.pm/elixir/1.12/Map.html  
https://hexdocs.pm/elixir/1.12/Enum.html  
https://hexdocs.pm/elixir/1.12/Process.html  
https://hexdocs.pm/elixir/1.12/Registry.html

## Authors

Yannis Laaroussi & Lucas Bürgi
