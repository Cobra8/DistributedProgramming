import Config # present at runtime, configure env vars that are needed at runtime here

config :backend, port: String.to_integer(System.get_env("BACKEND_PORT", "8081"))
config :backend, frontend_host: System.get_env("FRONTEND_HOST", "http://localhost:8080")

# export system env vars first (ex. export BACKEND_PORT=5123))
# compile for prod with "MIX_ENV=prod mix"
# run with "MIX_ENV=prod iex -S mix"
if config_env() == :prod do
  # prod related config
end
