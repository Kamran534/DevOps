export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "adapters/**/*.ts",
    "!src/index.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"]
}
