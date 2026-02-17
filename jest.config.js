module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    verbose: true,
    testTimeout: 30000,
    setupFiles: ["<rootDir>/jest.setup-env.js"],
};
