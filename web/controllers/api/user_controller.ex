defmodule PhoenixReact.Api.UserController do
  use PhoenixReact.Web, :controller

  alias PhoenixReact.User
  alias PhoenixReact.SessionController
  require IEx

  plug :action

  def index(conn, _params) do
    users = Repo.all(User)
    json(conn, %{ data: users, current_user: Guardian.Plug.current_resource(conn) })
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Guardian.Plug.current_resource(conn)
    changeset = User.update_changeset(user, user_params)

    if changeset.valid? do
      Repo.update(changeset)

      conn
      |> put_flash(:info, "User updated successfully.")
      |> redirect(to: user_path(conn, :index))
    else
      render(conn, "edit.html", user: user, changeset: changeset)
    end
  end

  def new(conn, _params) do
    changeset = User.create_changeset(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"user" => user_params}) do
    changeset = User.create_changeset(%User{}, user_params)
    if changeset.valid? do
      user = Repo.insert(changeset)
      Guardian.Plug.sign_in(user, :token, perms: %{ default: Guardian.Permissions.max })
      json(conn, %{ user: user })
    else
      json(conn, %{ user: changeset})
    end
  end
end
