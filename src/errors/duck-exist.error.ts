export class DuckExistError extends Error {
    constructor(message: string = 'Duck already exists') {
      super(message);
  
      this.name = 'DuckExistError';
    }
  }