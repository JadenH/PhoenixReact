defmodule PhoenixReact.PageController do
  use PhoenixReact.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
