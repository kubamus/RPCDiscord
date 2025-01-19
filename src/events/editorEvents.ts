import * as vscode from "vscode";
import { setActivity } from "../activity/activityManager";
import {Client} from "discord-rpc";
import { getSettings } from '../config/settingsManager';

export function registerEditorEvents(
  rpcClient: Client,
  startTimestamp?: number
) {
  vscode.window.onDidChangeActiveTextEditor(() => {
    const { details, state } = getSettings();
    setActivity(rpcClient, details, state, startTimestamp)
});

  vscode.window.onDidChangeTextEditorSelection(() => {
    const delay = 5000;
    let lastActivityUpdate = 0;
    const now = Date.now();

    if (now - lastActivityUpdate > delay) {
      const { details, state } = getSettings();
      setActivity(rpcClient, details, state, startTimestamp);
      lastActivityUpdate = now;
    }
  });
}
