defmodule Backend.MixProject do
  use Mix.Project

  def project do
    [
      app: :backend,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger, :cowboy, :plug, :plug_cowboy, :poison],
      mod: {Backend.Application, []}
    ]
  end

  defp deps do # inspect installed deps with "mix deps"
    [
      # {:cowboy, git: "https://github.com/ninenines/cowboy.git", tag: "2.9.0"},
      # {:plug, git: "https://github.com/elixir-plug/plug.git", tag: "v1.12.1"},
      {:plug_cowboy, git: "https://github.com/elixir-plug/plug_cowboy.git", tag: "v2.5.2"}, # uses cowboy 2.9.0 and plug 1.12.1 (since it uses the ~> operator which rounds to the latest version)
      {:poison, git: "https://github.com/devinus/poison.git", tag: "5.0.0"}
    ]
  end
end
