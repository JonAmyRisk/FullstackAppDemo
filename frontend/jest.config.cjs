module.exports = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'jest-environment-jsdom',

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  moduleFileExtensions: ['ts','tsx','js','jsx','json'],

  transform: {
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