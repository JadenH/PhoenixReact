defmodule PhoenixReact.UserQuery do
  import Ecto.Query
  alias PhoenixReact.User

  def by_email(email) do
    from u in User, where: u.email == ^email
  end
end
