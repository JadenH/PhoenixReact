defmodule PhoenixReact.ChatChannel do
  use Phoenix.Channel

  def join("chat:lobby", auth_msg, socket) do
    {:ok, socket}
  end

  def join("chat:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg", %{body: body, user: socket.assigns[:name]}
    {:noreply, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
