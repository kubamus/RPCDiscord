import * as vscode from "vscode";
import * as rpc from "discord-rpc";
import path from "path";

const rpcClient = new rpc.Client({ transport: "ipc" });

function processString(template: string, variables: Record<string, string>): string {
  return template.replace(/{\w+}/g, (placeholder) => {
    return variables[placeholder] || placeholder;
  });
}

function setActivity(details: string, state: string, startTimestamp?: number) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const filePath = path.basename(editor.document.fileName);
  const fileName = path.parse(filePath).name;
  const fileExtension = path.parse(filePath).ext;

  const workspace = vscode.workspace.name;
  const currentLine = editor.selection.active.line + 1;
  const currentColumn = editor.selection.active.character + 1;
  const totalLines = editor.document.lineCount;

  const availableVariables = {
    "{file_name}": fileName || " ",
    "{file_extension}": fileExtension || " ",
    "{file_path}": editor.document.fileName || " ",
    "{workspace}": workspace || "workspace",
    "{current_line}": currentLine.toString(),
    "{current_column}": currentColumn.toString(),
    "{total_lines}": totalLines.toString(),
  };

  const activity: rpc.Presence = {
    details: processString(details, availableVariables),
    state: processString(state, availableVariables),
    largeImageKey: "https://github.com/kubamus/RPCDiscord/raw/main/assets/vscode.png",
    startTimestamp: startTimestamp ? startTimestamp : undefined,
    largeImageText: "Visual Studio Code",
    instance: false,
    buttons: [
      { label: "GitHub", url: "https://github.com/kubamus" }
    ],
  };

  rpcClient.setActivity(activity);
}

interface Settings {
  details: string;
  state: string;
  show_time: boolean;
  client_id: string | null;
}

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('rpcDiscord');

  let settings: Settings = {
    details: config.get('details') || "Editing {file_name}{file_extension}",
    state: config.get('state') || "This file has {total_lines} lines",
    show_time: config.get('show_time') || true,
    client_id: config.get('client_id') || null,
  };

  let activity = {
    details: settings.details,
    state: settings.state,
    startTimestamp: settings.show_time ? Date.now() : undefined,
  };

  let lastDate = 0;

  if(!settings.client_id) {
    vscode.window.showErrorMessage("Please set your Client ID in the settings.");
    vscode.commands.executeCommand("workbench.action.openSettings", "rpcDiscord.client_id");
    vscode.workspace.onDidChangeConfiguration((e) => {
      if(e.affectsConfiguration("rpcDiscord")) {
        const updatedConfig = vscode.workspace.getConfiguration('rpcDiscord');
        settings.client_id = updatedConfig.get('client_id') || null;
        if(settings.client_id) {
          vscode.window.showInformationMessage("Client ID set successfully.");
          activate(context);
        }
      }
    }
    );
    return;
  }

  rpcClient.on("ready", () => {
    setActivity(activity.details, activity.state, activity.startTimestamp);

    vscode.window.onDidChangeActiveTextEditor(() =>
      setActivity(activity.details, activity.state, activity.startTimestamp)
    );

    vscode.workspace.onDidChangeTextDocument(() =>
      setActivity(activity.details, activity.state, activity.startTimestamp)
    );

    vscode.window.onDidChangeTextEditorSelection(() => {
      const currentDate = Date.now();
      const delay = 5000;
      if(currentDate - lastDate > delay) {
        setActivity(activity.details, activity.state, activity.startTimestamp);
        lastDate = currentDate;
      }
    });

    vscode.workspace.onDidSaveTextDocument(() =>
      setActivity(activity.details, activity.state, activity.startTimestamp)
    );

    vscode.workspace.onDidCloseTextDocument(() =>
      setActivity(activity.details, activity.state, activity.startTimestamp)
    );

    vscode.workspace.onDidOpenTextDocument(() =>
      setActivity(activity.details, activity.state, activity.startTimestamp)
    );

    vscode.workspace.onDidChangeConfiguration((e) => {
      if(e.affectsConfiguration("rpcDiscord")) {
        const updatedConfig = vscode.workspace.getConfiguration('rpcDiscord');

        settings = {
          details: updatedConfig.get('details') || "Editing {file_name}{file_extension}",
          state: updatedConfig.get('state') || "This file has {total_lines} lines",
          show_time: updatedConfig.get('show_time') || true,
          client_id: updatedConfig.get('client_id') || null
        };

        activity = {
          details: settings.details,
          state: settings.state,
          startTimestamp: settings.show_time ? Date.now() : undefined,
        };

        setActivity(activity.details, activity.state, activity.startTimestamp);
      }
    });
  });
  try {
    rpcClient.login({ 
      clientId: settings.client_id
    });
  } catch(error: any) {
    vscode.window.showErrorMessage("An error occurred while trying to connect to Discord. Please check your Client ID or check if your discord client is running.");
  }
}

export function deactivate() {
  rpcClient.destroy();
}
