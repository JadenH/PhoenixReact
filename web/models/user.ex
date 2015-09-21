defmodule PhoenixReact.User do
  use PhoenixReact.Web, :model

  alias PhoenixReact.Repo

  schema "users" do
    field :name, :string
    field :email, :string
    field :encrypted_password, :string
    field :password, :string, virtual: true

    timestamps
  end

  @required_register_fields ~w(name email password)
  @optional_register_fields ~w()

  @required_update_fields ~w(password)
  @optional_update_fields ~w(name, email)

  @password_min_length 5

  before_insert :maybe_update_password
  before_update :maybe_update_password

  def from_email(nil), do: { :error, :not_found }
  def from_email(email) do
    Repo.one(User, email: email)
  end

  def create_changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_register_fields, @optional_register_fields)
    |> validate_unique(:email, on: PhoenixReact.Repo, downcase: true)
    |> validate_length(:password, min: @password_min_length)
  end

  def update_changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_update_fields, @optional_update_fields)
    |> validate_unique(:email, on: PhoenixReact.Repo, downcase: true)
    |> validate_length(:password, min: @password_min_length)
  end

  def login_changeset(model), do: model |> cast(%{}, ~w(), ~w(email password))

  def login_changeset(model, params) do
    model
    |> cast(params, ~w(email password), ~w())
    |> validate_password
  end

  def valid_password?(nil, _), do: false
  def valid_password?(_, nil), do: false
  def valid_password?(password, crypted), do: Comeonin.Bcrypt.checkpw(password, crypted)

  defp maybe_update_password(changeset) do
    case Ecto.Changeset.fetch_change(changeset, :password) do
      { :ok, password } ->
        changeset
        |> Ecto.Changeset.put_change(:encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      :error -> changeset
    end
  end

  defp validate_password(changeset) do
    case Ecto.Changeset.get_field(changeset, :encrypted_password) do
      nil -> password_incorrect_error(changeset)
      crypted -> validate_password(changeset, crypted)
    end
  end

  defp validate_password(changeset, crypted) do
    password = Ecto.Changeset.get_change(changeset, :password)
    if valid_password?(password, crypted), do: changeset, else: password_incorrect_error(changeset)
  end

  defp password_incorrect_error(changeset), do: Ecto.Changeset.add_error(changeset, :password, "is incorrect")
end
