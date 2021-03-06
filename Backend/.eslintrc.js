module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb',
    "plugin:prettier/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: [
  ],
  rules: {
    "no-underscore-dangle": [2, { "allow": ["_id"] }],
    "no-unused-vars": ["warn"],
  },
};
