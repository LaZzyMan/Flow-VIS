module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      'ecmaVersion': 6,
      'sourceType': 'module',
      'ecmaFeatures': {
        'jsx': true
      }
    },
    env: {
      browser: true,
      node: true
    },
    extends: 'airbnb',
    globals: {
      __static: true
    },
    plugins: [
      'react',
      'jsx-a11y',
      'import'
    ],
    rules: {
      'no-plusplus': 0,
      'semi': [2, 'never'],
      'arrow-parens': 0,
      'generator-star-spacing': 0,
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
      'import/no-extraneous-dependencies': 0,
      'react/jsx-filename-extension': 0,
      'react/prefer-stateless-function': 0,
      'react/jsx-one-expression-per-line': 0,
      'import/no-unresolved': 0,
      'react/prop-types': 0,
      'react/jsx-first-prop-new-line': 0,
      'linebreak-style': [
        'error',
        'windows'
      ]
    },
    settings: {
      'import/core-modules': [
        'pages',
        'component',
        'router',
        'actions',
        'reducers'
      ]
    },
  }
  