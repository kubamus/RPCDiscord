import * as vscode from "vscode";
import * as rpc from "discord-rpc";
import { processString } from "../activity/templateProcessor";
import path from "path";

export function setActivity(
  rpcClient: rpc.Client,
  details: string,
  state: string,
  startTimestamp?: number
) {
  const editor = vscode.window.activeTextEditor;
  let variables = {};

  if (editor) {
    const filePath = vscode.workspace.asRelativePath(editor.document.fileName);
    const fileExtension = path.extname(filePath);
    const fileName = fileExtension.length > 0 ? path.basename(filePath, fileExtension) : path.basename(filePath);
    const workspace = vscode.workspace.name || "workspace";
    const currentLine = editor.selection.active.line + 1;
    const currentColumn = editor.selection.active.character + 1;
    const totalLines = editor.document.lineCount;

    variables = {
      "{file_name}": fileName,
      "{file_extension}": fileExtension,
      "{file_path}": filePath,
      "{workspace}": workspace,
      "{current_line}": currentLine.toString(),
      "{current_column}": currentColumn.toString(),
      "{total_lines}": totalLines.toString(),
    };
  }

  const activity: rpc.Presence = {
    details: processString(details, variables),
    state: processString(state, variables),
    startTimestamp,
    instance: false,
  };

  console.log(activity);

  rpcClient.setActivity({
    details: activity.details,
    state: activity.state,
    startTimestamp: activity.startTimestamp,
    instance: activity.instance,
  });
}