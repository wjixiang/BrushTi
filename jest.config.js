// jest.config.js
module.exports = {
    testEnvironment: 'node', // 或 'jsdom'，根据你的项目需求
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // 如果使用 TypeScript
    },
    testRegex: '(/src/.*|(\\.|/)(test|))\\.test\\.ts?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
