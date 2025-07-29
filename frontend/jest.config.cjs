module.exports = {
  // Use the ts-jest ESM preset
  preset: 'ts-jest/presets/default-esm',

  // We’re running in a browser-like environment
  testEnvironment: 'jest-environment-jsdom',

  // Make sure Jest knows .ts/.tsx files are ESM
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  moduleFileExtensions: ['ts','tsx','js','jsx','json'],

  transform: {
    // Hook ts-jest up in ESM mode and point at your Jest tsconfig:
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        useESM: true
      }
    ],
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy'
  },

  testMatch: [
    '<rootDir>/src/**/*.test.(ts|tsx)',
    '<rootDir>/src/**/*.spec.(ts|tsx)'
  ],
};