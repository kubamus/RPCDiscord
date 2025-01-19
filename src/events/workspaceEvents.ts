import * as vscode from "vscode";
import { setActivity } from "../activity/activityManager";
import { Client } from "discord-rpc";
import { getSettings } from "../config/settingsManager";

export function registerWorkspaceEvents(
  rpcClient: Client,
  startTimestamp?: number
) {
  vscode.workspace.onDidChangeTextDocument(() => {
    const { details, state } = getSettings();
    setActivity(rpcClient, details, state, startTimestamp);
  });

  vscode.workspace.onDidSaveTextDocument(() => {
    const { details, state } = getSettings();

    setActivity(rpcClient, details, state, startTimestamp);
  });

  vscode.workspace.onDidCloseTextDocument(() => {
    const { details, state } = getSettings();

    setActivity(rpcClient, details, state, startTimestamp);
  });

  vscode.workspace.onDidOpenTextDocument(() => {
    const { details, state } = getSettings();

    setActivity(rpcClient, details, state, startTimestamp);
  });
}
