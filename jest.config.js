export default {
  testEnvironment: 'node',
  setupFiles: ['./test/jest.setup.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!src/migrate.js', '!src/seed.js'],
  coverageThreshold: { global: { branches: 50, functions: 50, lines: 50, statements: 50 } },
  coverageReporters: ['text', 'json-summary'],
  transform: {},
}
