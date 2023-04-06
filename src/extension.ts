import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "graphql-querygenerator" is now active new!'
  );
  const location = vscode.workspace.getConfiguration("graphql-querygenerator");
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "graphql-querygenerator.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const items: vscode.QuickPickItem[] = [
        {
          label: "Queries",
        },
        {
          label: "Mutations",
        },
      ];
      const queriesItems: vscode.QuickPickItem[] = [
        {
          label: "SetListingPublished",
        },
      ];
      const actionType = await vscode.window.showQuickPick(items);
      if (actionType?.label === "Queries") {
        const queryPick = vscode.window.showQuickPick(queriesItems);
        const fileContent = await readFileInWorkspace("graphql/Message.gql");
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function readFileInWorkspace(fileName: any) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    // No workspace is open
    return null;
  }
  const workspacePath = workspaceFolders[0].uri.fsPath;
  const filePath = path.join(workspacePath, fileName);
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return fileContent;
  } catch (err) {
    console.error(`Error reading file ${fileName}`);
    return null;
  }
}
