const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    "!**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/utils/**",
    "!**/__tests__/**",
    // temporarily just collect coverage from tested files
    "**/usePelcro/*.{js,jsx}"
  ],
  coverageReporters: ["text", "json", "html"],
  verbose: true,
  testPathIgnorePatterns: ["<rootDir>/__tests__"],
  testTimeout: 20_000
};
module.exports = config;
