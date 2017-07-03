module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'max-len': ['error', 100, 2, {
      ignoreComments: false,
      ignorePattern: '\\s*<',
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true,
    }],
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
  },
};
