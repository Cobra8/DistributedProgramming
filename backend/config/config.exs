import Config # first file that is loaded (before compiling anything else!)

# export system env vars first (ex. export BACKEND_PORT=5123))
config :backend, port: String.to_integer(System.get_env("BACKEND_PORT", "8081"))
config :backend, frontend_host: System.get_env("FRONTEND_HOST", "http://localhost:8080")
