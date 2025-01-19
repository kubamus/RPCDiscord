import * as vscode from "vscode";
import { setActivity } from "../activity/activityManager";
import { Client } from "discord-rpc";
import { getSettings } from "../config/settingsManager";

export function registerWorkspaceEvents(
  rpcClient: Client,
  startTimestamp?: number
) {
  function updateActivity() {
    const { details, state, idleDetails, idleState } = getSettings();
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor !== undefined) {
      setActivity(rpcClient, details, state, startTimestamp);
    } else {
      setActivity(rpcClient, idleDetails, idleState, startTimestamp);
    }
  }

  vscode.workspace.onDidChangeTextDocument(updateActivity);
  vscode.workspace.onDidSaveTextDocument(updateActivity);
  vscode.workspace.onDidCloseTextDocument(updateActivity);
  vscode.workspace.onDidOpenTextDocument(updateActivity);
  vscode.window.onDidChangeActiveTextEditor(updateActivity);

  updateActivity();
}