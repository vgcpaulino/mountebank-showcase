
let jestConfig = {
    globalSetup: './jestCustom/jestGlobalSetup.js',
    globalTeardown: './jestCustom/jestGlobalTeardown.js',
    reporters: ['jest-spec-reporter'],
    setupFiles: ['./jestCustom/jestSetup.js'],
    setupFilesAfterEnv: [
        './jestCustom/jestHooks.js',
    ],
    testMatch: ['**/tests/**/*.test.js'],
    testRunner: 'jest-circus/runner',
    testTimeout: 180000,
};

module.exports = {
    ...jestConfig,
};
