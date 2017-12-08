module.exports = {
  testEnvironment: 'jsdom',
  verbose: true,
  moduleFileExtensions: [
    'js'
  ],
  transform: {
    '.*\\.(vue)$': './node_modules/vue-jest',
    '^.+\\.js$': './node_modules/babel-jest'
  },
  coverageDirectory: 'coverage',
  mapCoverage: true,
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'text'
  ],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  },
  'snapshotSerializers': [
    '<rootDir>/node_modules/jest-serializer-vue'
  ],
  setupTestFrameworkScriptFile: 'mock-local-storage',
  collectCoverageFrom: [
    '!env.js',
    // 'server/**/*.js',
    'app.js'
  ]
}
