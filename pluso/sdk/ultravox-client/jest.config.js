/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: [
    './tests/setup.ts'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^node-fetch$': 'node-fetch/lib/index.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(node-fetch)/)'
  ]
};
