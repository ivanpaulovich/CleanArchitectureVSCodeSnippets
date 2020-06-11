module.exports = {
    moduleFileExtensions: [
      "ts",
      "js"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    globals: {
      "ts-jest": {
        "tsConfigFile": "tsconfig.json"
      }
    },
    testPathIgnorePatterns: [
      '/node_modules/'
    ],
    testMatch: [
      "**/src/test/**/*.+(ts|js)"
    ],
    testPathIgnorePatterns: [
      "src/test/index.ts"
    ]
  };