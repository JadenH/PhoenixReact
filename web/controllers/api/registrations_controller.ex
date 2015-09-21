defmodule PhoenixReact.Api.RegistrationsController do
  use PhoenixReact.Web, :controller

  alias PhoenixReact.User

  plug :scrub_params, "user" when action in [:create, :update]

  def update(conn, %{"token" => token, "user" => user_params}) do
    case Guardian.decode_and_verify(token) do
      { :ok, claims } ->
        case Guardian.serializer.from_token(claims.sub) do
          { :ok, resource } ->
            changeset = User.update_changeset(resource, user_params)
            if changeset.valid? do
              user = elem(Repo.update(changeset), 1)
              json(conn, %{user: %{token: token, email: user.email, displayName: user.name}})
            else
              conn
              |> put_status(400)
              |> json(%{user: changeset})
            end
          { :error, reason } ->
            conn
            |> put_status(403)
            |> json(%{ error: :forbidden })
        end
      { :error, reason } ->
        conn
        |> put_status(403)
        |> json(%{ error: :forbidden })
    end
  end

  def create(conn, %{"user" => user_params}) do
    changeset = User.create_changeset(%User{}, user_params)
    if changeset.valid? do
      user = elem(Repo.insert(changeset), 1)
      jwt = elem(Guardian.encode_and_sign(user, :token),1)
      # perms: %{ default: Guardian.Permissions.max }
      json(conn, %{user: %{jwt: jwt, email: user.email, displayName: user.name}})
    else
      conn
      |> put_status(400)
      |> json(%{user: changeset})
    end
  end


  # def index(conn, _params) do
  #   users = Repo.all(User)
  #   json(conn, %{ data: users, current_user: Guardian.Plug.current_resource(conn) })
  # end

  # def new(conn, _params) do
  #   changeset = User.create_changeset(%User{})
  #   render(conn, "new.html", changeset: changeset)
  # end
end
