# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :phoenixReact, PhoenixReact.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "AZ1tmpuCvvXGT4M6Mo3iXOg+YTLk3ntiyyKal5KpFWGPAX7dO3bbNE8rSlCBtArR",
  render_errors: [default_format: "html"],
  pubsub: [name: PhoenixReact.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :joken, config_module: Guardian.JWT

config :guardian, Guardian,
  issuer: "PhoenixReact",
  ttl: { 30, :days },
  verify_issuer: true,
  secret_key: "g14687Nu6sAcp(IQ03I/kL;qLNO7q[",
  serializer: PhoenixReact.GuardianSerializer,
  hooks: PhoenixReact.GuardianHooks,
  permissions: %{
    default: [:read_profile, :write_profile]
  }
# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
