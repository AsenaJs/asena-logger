module.exports = {
  // Release tooling, not shipped code - lint it as the shell scripts beside it are: not at all.
  ignorePatterns: ['scripts/'],
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['alloy', 'alloy/typescript', 'prettier'],
  overrides: [
    {
      // Test files are held to the same correctness rules as lib, but not to its style rules.
      // A fixture class exists so a decorator has something to decorate; an accessibility
      // modifier on its throwaway method carries no information. And nesting is how the test
      // framework itself is written - describe > test > callback is three levels before the
      // assertion.
      files: ['test/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': 'off',
        'max-nested-callbacks': 'off',
        'max-lines-per-function': 'off',
      },
    },
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}', './**/*.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Style opinions inherited from the `alloy` preset. They are worth seeing, but an error
    // blocks a release and a parameter count does not deserve that - `xadd`/`xclaim` mirror
    // Redis's own command signatures, and a wrapper's member order is not a defect. The
    // reference packages (Asena, ergenecore) carry these as warnings too: 0 errors,
    // hundreds of warnings. Correctness rules stay errors.
    'max-params': 'warn',
    'max-depth': 'warn',
    complexity: 'warn',
    'no-param-reassign': 'warn',
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/class-literal-property-style': 'warn',
    '@typescript-eslint/prefer-for-of': 'warn',
    // Formatting is prettier's job - `extends: ['prettier']` above exists to hand it over.
    // `padded-blocks` and `lines-between-class-members` used to be re-enabled here, which
    // contradicted that and made `format` and `lint` fight: prettier removed the blank line
    // after a class brace and eslint demanded it back. The reference packages (Asena,
    // ergenecore, hono-adapter) set neither.
    // `void somePromise()` is the deliberate fire-and-forget idiom used across this
    // monorepo for work that must not block the caller and whose failure is handled
    // inside the promise. Flagging it here would only invite `.catch(() => {})`.
    'no-void': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/method-signature-style': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'any', prev: 'directive', next: 'directive' },
      { blankLine: 'always', prev: ['case', 'default'], next: '*' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'always', prev: 'class', next: '*' },
      { blankLine: 'always', prev: ['for', 'if', 'iife', 'do', 'try', 'while'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
    ],
  },
};
