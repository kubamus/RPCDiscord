# RPCDiscord

RPCDiscord is a customizable Visual Studio Code extension for Discord Rich Presence. It allows you to display detailed information about your current coding session on your Discord profile.

![Screenshot](https://github.com/kubamus/RPCDiscord/raw/main/assets/screen.jpg)

## Features

- Display the current file name, extension, path, workspace, line, column, and total lines in your Discord Rich Presence.
- Customize the rich presence details and state using variables.

## Variables

You can use the following variables in your rich presence templates:

- `{file_name}`: The name of the current file.
- `{file_extension}`: The extension of the current file.
- `{file_path}`: The full path of the current file.
- `{workspace}`: The name of the current workspace.
- `{current_line}`: The current line number in the file.
- `{current_column}`: The current column number in the file.
- `{total_lines}`: The total number of lines in the file.

## Usage

1. Install the extension.
2. Open your settings and configure the `rpcDiscord` settings:
   - `rpcDiscord.details`: Customize the details section of the rich presence.
   - `rpcDiscord.state`: Customize the state section of the rich presence.
   - `rpcDiscord.show_time`: Toggle to show the time in the rich presence.
   - `rpcDiscord.client_id`: Provide your Discord application client ID.

## Getting Your Discord Application Client ID
Go to the [Discord Developer Portal](https://discord.com/developers/applications).
Click on "New Application" and create a new application.
Copy the "Client ID" from the application settings.
Paste the Client ID into the rpcDiscord.client_id setting in your VS Code settings.

## Example Configuration

```json
{
  "rpcDiscord.details": "Editing {file_name}{file_extension}",
  "rpcDiscord.state": "This file has {total_lines} lines",
  "rpcDiscord.show_time": true,
  "rpcDiscord.client_id": "YOUR_DISCORD_CLIENT_ID"
}
```

## Contributing

We welcome contributions to RPCDiscord! If you have any suggestions, bug reports, or want to contribute code, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

Thank you for your contributions!