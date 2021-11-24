import Config # present at runtime, configure env vars that are needed at runtime here

# compile for prod with "MIX_ENV=prod mix"
# run with "MIX_ENV=prod iex -S mix"
if config_env() == :prod do
  # prod related config
end
