module.exports = {
  "extends": [
  "airbnb",
  "prettier",
  "prettier/react",
  "plugin:prettier/recommended",
  "eslint-config-prettier"
  ],
  "parser": "babel-eslint",
  "rules": {
    "import/no-unresolved": "off",
    "no-unused-vars": "warn",
    "no-use-before-define": ["off", {"styles": true}],
    "react/no-unused-state": "warn",
    "react/destructuring-assignment": "off",
    "react/jsx-filename-extension": [
    1,
    {
    "extensions": [".js", ".jsx"]
    }
    ],
    "prettier/prettier": [
    "error",
    {
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100
    }
    ]
  },
  "plugins": ["prettier"]
  }