module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    jest: true,
    es6: true
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: ['./'],
        alias: {
          mobile: './'
        }
      }
    }
  },
  rules: {
    'prefer-destructuring': 'off',
    'react/no-multi-comp': 'off',
    'no-underscore-dangle': 'off',
    'react/destructuring/assignment': 'off',
    camelcase: 'off',
    'prettier/prettier': ['error'],
    'react/require-default-props': 'off',
    'no-return-assign': 'off'
  }
};
