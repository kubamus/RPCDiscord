import * as vscode from "vscode";

export interface Settings {
  details: string;
  state: string;
  show_time: boolean;
  client_id: string | null;
  idleDetails: string;
  idleState: string;
}

export function getSettings(): Settings {
  const config = vscode.workspace.getConfiguration("rpcDiscord");
  return {
    details: config.get("details") || "Editing {file_name}{file_extension}",
    state: config.get("state") || "This file has {total_lines} lines",
    show_time: config.get("show_time") || true,
    client_id: config.get("client_id") || null,
    idleDetails: config.get("idle_details") || "Idling",
    idleState: config.get("idle_state") || "Browsing files",
  };
}
