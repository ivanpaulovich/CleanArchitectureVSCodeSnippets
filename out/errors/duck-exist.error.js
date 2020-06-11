"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuckExistError = void 0;
class DuckExistError extends Error {
    constructor(message = 'Duck already exists') {
        super(message);
        this.name = 'DuckExistError';
    }
}
exports.DuckExistError = DuckExistError;
//# sourceMappingURL=duck-exist.error.js.map