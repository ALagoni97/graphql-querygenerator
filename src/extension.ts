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
      await fetchCurrentAvailableQueries();
      if (actionType?.label === "Queries") {
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function fetchCurrentAvailableQueries() {
  const folderPath = vscode.workspace.workspaceFolders + "/graphql";
  const globPattern = "**/*.gql";
  const queries: { label: string }[] = [];
  vscode.workspace.findFiles(globPattern, folderPath).then(
    (files) => {
      files.forEach((fileUri) => {
        vscode.workspace.fs.readFile(fileUri).then(
          (fileData) => {
            // Do something with the file data
            const data = fileData.toString();
            const query = data.split("Query {")[1].split("}")[0];
            const queryNames = matchQueryNames(query);
            console.log("quer", queryNames);
            queryNames.map((name) => queries.push({ label: name }));
          },
          (error) => {
            console.error(error);
          }
        );
      });
    },
    (error) => {
      console.error(error);
    }
  );
  console.log("queries", queries);
}

function matchQueryNames(queryString: string) {
  const regExp = /(?:query|mutation|subscription)?\s*(\w+)\s*\(/g;
  const matches = [];
  let match;
  while ((match = regExp.exec(queryString)) !== null) {
    if (match.index === regExp.lastIndex) {
      regExp.lastIndex++;
    }
    if (match[1] !== "auth") {
      matches.push(match[1]);
    }
  }
  return matches;
}
