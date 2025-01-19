import * as rpc from "discord-rpc";

export function createRpcClient(clientId: string): rpc.Client {
  const client = new rpc.Client({ transport: "ipc" });
  client.login({ clientId }).catch((error) => {
    throw new Error(
      "Failed to connect to Discord. Ensure Discord is running and the Client ID is correct."
    );
  });
  return client;
}
