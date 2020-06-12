"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const os = require("os");
const parentfinder = require('find-parent-dir');
const findupglob = require('find-up-glob');
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.newEntity', newEntity));
    context.subscriptions.push(vscode.commands.registerCommand('extension.newEntityInterface', newEntityInterface));
    context.subscriptions.push(vscode.commands.registerCommand('extension.newFactory', newFactory));
    context.subscriptions.push(vscode.commands.registerCommand('extension.newService', newService));
    context.subscriptions.push(vscode.commands.registerCommand('extension.newValueObject', newValueObject));
}
exports.activate = activate;
function newEntity(args) {
    promptAndSave(args, 'entity', 'domain/entity.tmpl');
}
function newEntityInterface(args) {
    promptAndSave(args, 'entity interface', 'domain/entity-interface.tmpl');
}
function newFactory(args) {
    promptAndSave(args, 'factory', 'domain/factory.tmpl');
}
function newService(args) {
    promptAndSave(args, 'service', 'domain/service.tmpl');
}
function newValueObject(args) {
    promptAndSave(args, 'service', 'domain/value-object.tmpl');
}
function promptAndSave(args, type, templatetype) {
    if (args == null) {
        args = { _fsPath: vscode.workspace.rootPath };
    }
    let incomingpath = args._fsPath;
    vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter filename', value: 'new' + type + '.cs' })
        .then((newfilename) => {
        if (typeof newfilename === 'undefined') {
            return;
        }
        var newfilepath = incomingpath + path.sep + newfilename;
        if (fs.existsSync(newfilepath)) {
            vscode.window.showErrorMessage("File already exists");
            return;
        }
        newfilepath = correctExtension(newfilepath);
        var originalfilepath = newfilepath;
        var projectrootdir = getProjectRootDirOfFilePath(newfilepath);
        if (projectrootdir == null) {
            vscode.window.showErrorMessage("Unable to find project.json or *.csproj");
            return;
        }
        projectrootdir = removeTrailingSeparator(projectrootdir);
        var newroot = projectrootdir.substr(projectrootdir.lastIndexOf(path.sep) + 1);
        var filenamechildpath = newfilepath.substring(newfilepath.lastIndexOf(newroot));
        var pathSepRegEx = /\//g;
        if (os.platform() === "win32")
            pathSepRegEx = /\\/g;
        var namespace = path.dirname(filenamechildpath);
        namespace = namespace.replace(pathSepRegEx, '.');
        namespace = namespace.replace(/\s+/g, "_");
        namespace = namespace.replace(/-/g, "_");
        newfilepath = path.basename(newfilepath, '.cs');
        openTemplateAndSaveNewFile(templatetype, namespace, newfilepath, originalfilepath);
    });
}
function correctExtension(filename) {
    if (path.extname(filename) !== '.cs') {
        if (filename.endsWith('.')) {
            filename = filename + 'cs';
        }
        else {
            filename = filename + '.cs';
        }
    }
    return filename;
}
function removeTrailingSeparator(filepath) {
    if (filepath[filepath.length - 1] === path.sep) {
        filepath = filepath.substr(0, filepath.length - 1);
    }
    return filepath;
}
function getProjectRootDirOfFilePath(filepath) {
    var projectrootdir = parentfinder.sync(path.dirname(filepath), 'project.json');
    if (projectrootdir == null) {
        var csprojfiles = findupglob.sync('*.csproj', { cwd: path.dirname(filepath) });
        if (csprojfiles == null) {
            return null;
        }
        projectrootdir = path.dirname(csprojfiles[0]);
    }
    return projectrootdir;
}
function openTemplateAndSaveNewFile(templatefileName, namespace, filename, originalfilepath) {
    vscode.workspace.openTextDocument(vscode.extensions.getExtension('ivanpaulovich.clean-architecture-csharp-snippets').extensionPath + '/src/templates/' + templatefileName)
        .then((doc) => {
        let text = doc.getText();
        text = text.replace('${namespace}', namespace);
        text = text.replace('${classname}', filename);
        text = text.replace('${interfacename}', filename);
        text = text.replace('${structname}', filename);
        let cursorPosition = findCursorInTemplate(text);
        text = text.replace('${cursor}', '');
        fs.writeFileSync(originalfilepath, text);
        openDocument(originalfilepath, cursorPosition);
    });
}
function openDocument(originalfilepath, cursorPosition) {
    vscode.workspace.openTextDocument(originalfilepath).then((doc) => {
        vscode.window.showTextDocument(doc).then((editor) => {
            let newselection = new vscode.Selection(cursorPosition, cursorPosition);
            editor.selection = newselection;
        });
    });
}
function findCursorInTemplate(text) {
    let cursorPos = text.indexOf('${cursor}');
    let preCursor = text.substr(0, cursorPos);
    let lineNum = preCursor.match(/\n/gi).length;
    let charNum = preCursor.substr(preCursor.lastIndexOf('\n')).length;
    return new vscode.Position(lineNum, charNum);
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map