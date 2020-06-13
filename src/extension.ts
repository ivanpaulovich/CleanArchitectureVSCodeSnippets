import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const parentfinder = require('find-parent-dir');
const findupglob = require('find-up-glob');

export function activate(context: ExtensionContext) {
  // domain
  context.subscriptions.push(vscode.commands.registerCommand('extension.newAggregateRoot', newAggregateRoot));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newEntity', newEntity));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newFactory', newFactory));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newService', newService));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newValueObject', newValueObject));

  // application
  context.subscriptions.push(vscode.commands.registerCommand('extension.newBoundary', newBoundary));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newApplicationService', newApplicationService));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newUnitOfWork', newUnitOfWork));
  context.subscriptions.push(vscode.commands.registerCommand('extension.newUseCase', newUseCase));
}

async function newAggregateRoot(args: { _fsPath: any; } | null) {
  const input = await vscode.window.showInputBox(
    {
      ignoreFocusOut: true,
      prompt: 'Please enter the `Aggregate root name`.',
      placeHolder: 'AggregateRoot',
      value: 'AggregateRoot',
      validateInput: (text: string) => text == '' ? 'input is required.' : ''
    }
  );

  if (input == '')
  {
    vscode.window.showErrorMessage("`Aggregate root name` can't be empty.");
  }

  if (args == null) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingPath: string = args._fsPath;

  var destinationEntityFileName = incomingPath + path.sep + input + '.cs';
  var destinationEntityInterfaceFileName = incomingPath + path.sep + 'I' + input + '.cs';
  var destinationRepositoryInterfaceFileName = incomingPath + path.sep + 'I' + input + 'Repository.cs';


  if (await checkFileExists(destinationEntityFileName) || 
    await checkFileExists(destinationEntityInterfaceFileName) ||
    await checkFileExists(destinationRepositoryInterfaceFileName))
  {
    return;
  }

  let namespace = getNamespace(destinationEntityFileName);

  openTemplateAndSaveNewFile(`domain${path.sep}aggregate-root${path.sep}entity.tmpl`, destinationEntityFileName, namespace, input);
  openTemplateAndSaveNewFile(`domain${path.sep}aggregate-root${path.sep}entity-interface.tmpl`, destinationEntityInterfaceFileName, namespace, input);
  openTemplateAndSaveNewFile(`domain${path.sep}aggregate-root${path.sep}repository-interface.tmpl`, destinationRepositoryInterfaceFileName, namespace, input);
}

async function newEntity(args: { _fsPath: any; } | null) {
  const input = await vscode.window.showInputBox(
    {
      ignoreFocusOut: true,
      prompt: 'Please enter the `Entity name`.',
      placeHolder: 'Entity',
      value: 'Entity',
      validateInput: (text: string) => text == '' ? 'input is required.' : ''
    }
  );

  if (input == '')
  {
    vscode.window.showErrorMessage("`Entity name` can't be empty.");
  }

  if (args == null) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingPath: string = args._fsPath;

  var destinationEntityFileName = incomingPath + path.sep + input + '.cs';
  var destinationEntityInterfaceFileName = incomingPath + path.sep + 'I' + input + '.cs';

  if (await checkFileExists(destinationEntityFileName) || await checkFileExists(destinationEntityInterfaceFileName))
  {
    return;
  }

  let namespace = getNamespace(destinationEntityFileName);

  openTemplateAndSaveNewFile(`domain${path.sep}entity${path.sep}entity.tmpl`, destinationEntityFileName, namespace, input);
  openTemplateAndSaveNewFile(`domain${path.sep}entity${path.sep}entity-interface.tmpl`, destinationEntityInterfaceFileName, namespace, input);
}

async function newFactory(args: any) {
  const input = await vscode.window.showInputBox(
    {
      ignoreFocusOut: true,
      prompt: 'Please enter the `Factory name`.',
      placeHolder: 'Factory',
      value: 'Factory',
      validateInput: (text: string) => text == '' ? 'input is required.' : ''
    }
  );

  if (input == '')
  {
    vscode.window.showErrorMessage("`Factory name` can't be empty.");
  }

  if (args == null) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingPath: string = args._fsPath;

  var destinationFactoryFileName = incomingPath + path.sep + input + '.cs';

  if (await checkFileExists(destinationFactoryFileName))
  {
    return;
  }

  let namespace = getNamespace(destinationFactoryFileName);

  openTemplateAndSaveNewFile(`domain${path.sep}factory.tmpl`, destinationFactoryFileName, namespace, input);
}

async function newService(args: any) {
  const input = await vscode.window.showInputBox(
    {
      ignoreFocusOut: true,
      prompt: 'Please enter the `Service name`.',
      placeHolder: 'Service',
      value: 'Service',
      validateInput: (text: string) => text == '' ? 'input is required.' : ''
    }
  );

  if (input == '')
  {
    vscode.window.showErrorMessage("`Service name` can't be empty.");
  }

  if (args == null) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingPath: string = args._fsPath;

  var destinationServiceFileName = incomingPath + path.sep + input + '.cs';

  if (await checkFileExists(destinationServiceFileName))
  {
    return;
  }

  let namespace = getNamespace(destinationServiceFileName);

  openTemplateAndSaveNewFile(`domain${path.sep}service.tmpl`, destinationServiceFileName, namespace, input);
}

async function newValueObject(args: any) {
  const input = await vscode.window.showInputBox(
    {
      ignoreFocusOut: true,
      prompt: 'Please enter the `Value Object name`.',
      placeHolder: 'ValueObject',
      value: 'ValueObject',
      validateInput: (text: string) => text == '' ? 'input is required.' : ''
    }
  );

  if (input == '')
  {
    vscode.window.showErrorMessage("`Value Object name` can't be empty.");
  }

  if (args == null) {
    args = { _fsPath: vscode.workspace.rootPath }
  }

  let incomingPath: string = args._fsPath;

  var destinationValueObjectFileName = incomingPath + path.sep + input + '.cs';

  if (await checkFileExists(destinationValueObjectFileName))
  {
    return;
  }

  let namespace = getNamespace(destinationValueObjectFileName);

  openTemplateAndSaveNewFile(`domain${path.sep}value-object.tmpl`, destinationValueObjectFileName, namespace, input);
}

async function checkFileExists(destinationFileName: string) : Promise<boolean>
{
  if (fs.existsSync(destinationFileName)) {
    await vscode.window.showErrorMessage(`${ destinationFileName } already exists.`);
    return true;
  }

  return false;
}

function getNamespace(destinationFileName: string)
{
  var projectRootDir = getProjectRootDirOfFilePath(destinationFileName);

  if (projectRootDir == null) {
    vscode.window.showErrorMessage("Unable to find project.json or *.csproj");
    return 'Domain';
  }

  projectRootDir = removeTrailingSeparator(projectRootDir);

  var newRootDir = projectRootDir.substr(projectRootDir.lastIndexOf(path.sep) + 1);

  var filenameChildPath = destinationFileName.substring(destinationFileName.lastIndexOf(newRootDir));

  var pathSepRegEx = /\//g;
  if (os.platform() === "win32")
    pathSepRegEx = /\\/g;

  var namespace = path.dirname(filenameChildPath);
  namespace = namespace.replace(pathSepRegEx, '.');

  namespace = namespace.replace(/\s+/g, "_");
  namespace = namespace.replace(/-/g, "_");

  return namespace;
}



function newBoundary(args: any) {
  //promptAndSave(args, 'service', 'application/boundary/input.tmpl', 'application/boundary/output.tmpl', 'application/boundary/usecase-interface.tmpl', 'application/boundary/usecase-output-port.tmpl', );
}

function newApplicationService(args: any) {
  promptAndSave(args, 'service', 'application/service.tmpl');
}

function newUnitOfWork(args: any) {
  promptAndSave(args, 'service', 'application/unit-of-work.tmpl');
}

function newUseCase(args: any) {
  promptAndSave(args, 'service', 'application/usecase.tmpl');
}

function promptAndSave(args: { _fsPath: any; } | null, type: string, templatetype: string) {
  if (args == null) {
    args = { _fsPath: vscode.workspace.rootPath }
  }
  let incomingpath: string = args._fsPath;
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

function correctExtension(filename: string) {
  if (path.extname(filename) !== '.cs') {
    if (filename.endsWith('.')) {
      filename = filename + 'cs';
    } else {
      filename = filename + '.cs';
    }
  }
  return filename;
}

function removeTrailingSeparator(filepath: string) {
  if (filepath[filepath.length - 1] === path.sep) {
    filepath = filepath!.substr(0, filepath.length - 1);
  }
  return filepath;
}

function getProjectRootDirOfFilePath(filepath: string) {
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

function openTemplateAndSaveNewFile(templateFileName: string, destinationFileName: string, namespace: string, input: string) {
  vscode.workspace.openTextDocument(`${vscode.extensions.getExtension('ivanpaulovich.clean-architecture-csharp-snippets').extensionPath}${path.sep}src${path.sep}templates${path.sep}${templateFileName}`)
    .then((doc: vscode.TextDocument) => {
      let text = doc.getText();

      text = text.replace('${namespace}', namespace);
      text = text.replace('${classname}', input);
      text = text.replace('${interfacename}', input);
      text = text.replace('${structname}', input);
      text = text.replace('${structname}', input);

      let cursorPosition = findCursorInTemplate(text);
      text = text.replace('${cursor}', '');
      fs.writeFileSync(destinationFileName, text);

      openDocument(destinationFileName, cursorPosition);
    });
}

function openDocument(originalfilepath: string, cursorPosition: vscode.Position) {
  vscode.workspace.openTextDocument(originalfilepath).then((doc) => {
    vscode.window.showTextDocument(doc).then((editor) => {
      let newselection = new vscode.Selection(cursorPosition, cursorPosition);
      editor.selection = newselection;
    });
  });
}

function findCursorInTemplate(text: string) {
  let cursorPos = text.indexOf('${cursor}');
  let preCursor = text.substr(0, cursorPos);
  let lineNum = preCursor.match(/\n/gi)!.length;
  let charNum = preCursor.substr(preCursor.lastIndexOf('\n')).length;
  return new vscode.Position(lineNum, charNum);
}
export function deactivate() { }