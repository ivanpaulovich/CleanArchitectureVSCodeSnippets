"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const entity_generator_1 = require("./entity-generator");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const workspaceRoot = "src";
    const generator = new entity_generator_1.DuckGenerator(workspaceRoot, vscode_1.window);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode_1.commands.registerCommand('extension.generateDuck', () => {
        // The code you place here will be executed every time your command is executed
        generator.execute();
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(generator);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map