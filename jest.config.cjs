module.exports = {
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  transform: {
    "^.+\\.[t|j]sx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/(?!(@m))/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^src/(.*)$": '<rootDir>/src/$1',
  },
};
