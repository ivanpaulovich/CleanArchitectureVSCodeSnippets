import { commands, window, ExtensionContext } from 'vscode';
import { DuckGenerator } from './entity-generator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const workspaceRoot: string = "src";
  const generator = new DuckGenerator(workspaceRoot, window);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('extension.generateDuck', () => {
    // The code you place here will be executed every time your command is executed
    generator.execute();
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(generator);
}

// this method is called when your extension is deactivated
export function deactivate() { }