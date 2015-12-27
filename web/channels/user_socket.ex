defmodule PhoenixReact.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "chat:*", PhoenixReact.ChatChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket
  transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.

  def connect(params, socket) do
    if (params["jwt"]) do
      case Guardian.decode_and_verify(params["jwt"]) do
        {:ok, claims} ->
          case Guardian.serializer.from_token(claims["sub"]) do
            {:ok, user} ->
              socket = assign(socket, :name, user.name)
              {:ok, assign(socket, :user_id, user.id)}
            {:error, reason} ->
              {:error, reason}
          end
        {:error, reason} ->
          {:error, reason}
      end
    else
      :error
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "users_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     PhoenixReact.Endpoint.broadcast("users_socket:" <> user.id, "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(socket), do: "users_socket:" <> to_string(socket.assigns.user_id)

end