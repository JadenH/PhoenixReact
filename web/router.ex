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
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/", PhoenixReact do
    pipe_through [:browser, :browser_session] # Use the default browser stack
    get "/", PageController, :index
  end

  scope "/api", PhoenixReact.Api do
    pipe_through :api

    get "/", PageController, :index
    get "/login", SessionController, :new, as: :login
    post "/login", SessionController, :create, as: :login
    delete "/logout", SessionController, :delete, as: :logout
    get "/logout", SessionController, :delete, as: :logout

    resources "/users", UserController
  end

  # ------------------------------------------------------------------------------

  defp token(conn) do
    if current_user = conn.assigns[:current_user] do
      token = Guardian.encode_and_sign(current_user, :token)
    end
    token
  end

  defp default_settings(conn, _) do
    # "http://" <> Application.get_env(:phoenixReact, PhoenixReact.Endpoint)[:url][:host] <>
    default_settings = %{
      api_url: "/api",
      jwt: token(conn),
      csrfToken: get_csrf_token()
    }
    assign(conn, :default_settings, Poison.encode!(default_settings))
  end

end
