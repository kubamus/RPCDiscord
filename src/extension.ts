import * as vscode from "vscode";
import { getSettings } from "./config/settingsManager";
import { createRpcClient } from "./rpc/rpcClient";
import { registerEditorEvents } from "./events/editorEvents";
import { registerWorkspaceEvents } from "./events/workspaceEvents";
import { setActivity } from "./activity/activityManager";
import { Client } from "discord-rpc";

let rpcClient: Client;

export function activate(context: vscode.ExtensionContext) {
  let settings = getSettings();

  if (!settings.client_id) {
    vscode.window.showErrorMessage("Please set your Client ID in the settings.");
    vscode.commands.executeCommand("workbench.action.openSettings", "rpcDiscord.client_id");
    return;
  }

  rpcClient = createRpcClient(settings.client_id);

  rpcClient.on("ready", () => {
    const startTimestamp = settings.show_time ? Date.now() : undefined;

    setActivity(rpcClient, settings.details, settings.state, startTimestamp);

    registerEditorEvents(rpcClient, startTimestamp);
    registerWorkspaceEvents(rpcClient, startTimestamp);

    vscode.workspace.onDidChangeConfiguration(() => {
      settings = getSettings();
      setActivity(
        rpcClient,
        settings.details,
        settings.state,
        settings.show_time ? Date.now() : undefined
      );
    });
  });
}

export function deactivate() {
  rpcClient.destroy();
}
