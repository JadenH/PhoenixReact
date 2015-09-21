defmodule PhoenixReact.Api.SessionController do
  use PhoenixReact.Web, :controller

  alias PhoenixReact.User
  alias PhoenixReact.UserQuery

  plug :scrub_params, "user" when action in [:create]

  # def new(conn, params) do
  #   changeset = User.login_changeset(%User{})
  #   render(conn, PhoenixReact.SessionView, "new.html", changeset: changeset)
  # end

  def create(conn, params = %{}) do
    user = Repo.one(UserQuery.by_email(params["user"]["email"] || ""))
    if user do
      changeset = User.login_changeset(user, params["user"])
      if changeset.valid? do
        jwt = elem(Guardian.encode_and_sign(user, :token),1)
        # perms: %{ default: Guardian.Permissions.max }
        json(conn, %{user: %{jwt: jwt, email: user.email, displayName: user.name}})
      else
        conn
        |> put_status(400)
        |> json(%{user: changeset})
      end
    else
      conn
      |> put_status(400)
      |> json(%{user: "not found"})
    end
  end

  def delete(conn, _params) do
    json(conn, %{info: "Logged out successfully."})
  end

  def unauthenticated_api(conn, _params) do
    the_conn = put_status(conn, 401)
    case Guardian.Plug.claims(conn) do
      { :error, :no_session } -> json(the_conn, %{ error: "Login required" })
      { :error, reason } -> json(the_conn, %{ error: reason })
      _ -> json(the_conn, %{ error: "Login required" })
    end
  end

  def forbidden_api(conn, _) do
    conn
    |> put_status(403)
    |> json(%{ error: :forbidden })
  end
end
