module.exports = {
    preset: 'ts-jest/presets/js-with-ts', // Use ts-jest for TypeScript support
    testEnvironment: 'jsdom', // Use jsdom for React testing
    transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)', // Allow Jest to transform ES Modules in axios
    ],
  };