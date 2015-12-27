use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.

# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
#"node_modules/webpack/bin/webpack.js"
# Disabled brunch in favor of webpack.
config :phoenixReact, PhoenixReact.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  cache_static_lookup: false
  # watchers: [{Path.expand("webpack.devserver.js"), ["--watch", "--colors", "--progress"]}]

# Watch static and templates for browser reloading.
# Disabled live reload of static folder. Webpack will handle this for us.
config :phoenixReact, PhoenixReact.Endpoint,
  live_reload: [
    patterns: [
      # ~r{priv/static/.*(js|css|png|jpeg|jpg|gif)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Configure your database
config :phoenixReact, PhoenixReact.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "jaden",
  password: "",
  database: "phoenixreact_dev",
  size: 10 # The amount of database connections in the pool
