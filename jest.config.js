module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/tests/unit/**/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["vue", "js", "ts", "tsx"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest-setup.ts"],
  transformIgnorePatterns: ["/node_modules/(?!(lodash-es|axios|rgb-hex|vue))"],
};
