defmodule PhoenixReact.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :email, :string
      add :encrypted_password, :string
      add :password, :string

      timestamps
    end

  end
end
