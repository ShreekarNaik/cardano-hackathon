module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@decentralai/cardano-integration/(.*)$': '<rootDir>/packages/cardano-integration/$1',
    '^@decentralai/masumi-integration/(.*)$': '<rootDir>/packages/masumi-integration/$1',
    '^@decentralai/hydra-layer2/(.*)$': '<rootDir>/packages/hydra-layer2/$1'
  }
};
