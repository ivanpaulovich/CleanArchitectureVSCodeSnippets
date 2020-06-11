"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuckGenerator = void 0;
const path = require("path");
const fs = require("fs");
const duck_exist_error_1 = require("./errors/duck-exist.error");
class DuckGenerator {
    constructor(workspaceRoot, window) {
        this.workspaceRoot = workspaceRoot;
        this.window = window;
        this.extension = '.js';
        this.duckFiles = ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'];
        this.defaultPath = 'src/state/ducks';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // prompt for the name of the duck, or the path to create the duck in
            const duckname = yield this.prompt();
            if (!duckname) {
                return;
            }
            const absoluteDuckPath = this.toAbsolutePath(duckname);
            try {
                this.create(absoluteDuckPath);
                this.window.showInformationMessage(`Duck: '${duckname}' successfully created`);
            }
            catch (err) {
                // log?
                if (err instanceof duck_exist_error_1.DuckExistError) {
                    this.window.showErrorMessage(`Duck: '${duckname}' already exists`);
                }
                else {
                    this.window.showErrorMessage(`Error: ${err.message}`);
                }
            }
        });
    }
    prompt() {
        return __awaiter(this, void 0, void 0, function* () {
            // this can be abstracted out as an argument for prompt
            const options = {
                ignoreFocusOut: true,
                prompt: `Duck name: 'some_duck', or a relative path: 'src/state/ducks/some_duck'`,
                placeHolder: 'quack'
            };
            return yield this.window.showInputBox(options);
        });
    }
    create(absoluteDuckPath) {
        if (fs.existsSync(absoluteDuckPath)) {
            const duck = path.basename(absoluteDuckPath);
            throw new duck_exist_error_1.DuckExistError(`'${duck}' already exists`);
        }
        try {
            // create the directory
            fs.mkdirSync(absoluteDuckPath);
            this.duckFiles.forEach((file) => {
                const filename = `${file}${this.extension}`;
                const fullpath = path.join(absoluteDuckPath, filename);
                fs.writeFileSync(fullpath, `/* ${filename} */`);
            });
        }
        catch (err) {
            // log other than console?
            console.log('Error', err.message);
            throw err;
        }
    }
    validate(name) {
        if (!name) {
            return 'Name is required';
        }
        if (name.includes(' ')) {
            return 'Spaces are not allowed';
        }
        // no errors
        return null;
    }
    toAbsolutePath(nameOrRelativePath) {
        // simple test for slashes in string
        if (/\/|\\/.test(nameOrRelativePath)) {
            return path.resolve(this.workspaceRoot, nameOrRelativePath);
        }
        // if it's just the name of the duck, assume that it'll be in 'src/state/ducks/'
        return path.resolve(this.workspaceRoot, this.defaultPath, nameOrRelativePath);
    }
    dispose() {
        console.log('disposing...');
    }
}
exports.DuckGenerator = DuckGenerator;
//# sourceMappingURL=entity-generator.js.map