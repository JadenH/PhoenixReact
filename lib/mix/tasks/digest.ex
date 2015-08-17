defmodule Mix.Tasks.PhoenixReact.Digest do
  use Mix.Task

  def run(args) do
    Mix.Shell.IO.cmd "./node_modules/webpack/bin/webpack.js"
    :ok = Mix.Tasks.Phoenix.Digest.run(args)
  end
end