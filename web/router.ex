defmodule PhoenixReact.Router do
  use PhoenixReact.Web, :router
  require IEx

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :default_settings
  end

  pipeline :browser_session do
    # plug Guardian.Plug.VerifySession
    # plug Guardian.Plug.LoadResource
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug :protect_from_forgery
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/", PhoenixReact do
    pipe_through [:browser, :browser_session] # Use the default browser stack
    get "/", PageController, :index
  end

  scope "/api", PhoenixReact.Api do
    pipe_through :api

    post "/sign_in", SessionController, :create, as: :login
    delete "/sign_out", SessionController, :delete, as: :logout
    post "/sign_up", RegistrationsController, :create, as: :register
    post "/account_update", RegistrationsController, :update, as: :account_update

  end

  # ------------------------------------------------------------------------------

  defp default_settings(conn, _) do
    # "http://" <> Application.get_env(:phoenixReact, PhoenixReact.Endpoint)[:url][:host] <>
    default_settings = %{
      api_url: "/api",
      csrfToken: get_csrf_token()
    }
    assign(conn, :default_settings, Poison.encode!(default_settings))
  end

end
