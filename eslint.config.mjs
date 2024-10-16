import js from '@eslint/js';
import depend from 'eslint-plugin-depend';
import jsdoc from 'eslint-plugin-jsdoc';
import globals from 'globals';

export default [
    jsdoc.configs['flat/recommended'],
    depend.configs['flat/recommended'],
    // http://eslint.org/docs/rules/
    {
        languageOptions: {
            ecmaVersion: 13,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.amd,
                ...globals.jasmine,
                ...globals.jest,
                ...globals.es2015,
                ...globals.node
            }
        }
    },
    {
        ignores: [
            '**/*.test.js',
            '**/*.spec.js',
            '**/*.config.js'
        ],
        rules: {
            ...js.configs.recommended.rules,
            'default-case': 'error',
            'id-length': [
                'error',
                {
                    min: 2,
                    exceptions: ['id']
                }
            ],
            'no-alert': 'error',
            'no-duplicate-imports': 'error',
            'no-implicit-coercion': 'error',
            'no-implied-eval': 'error',
            'no-invalid-this': 'error',
            'no-labels': 'error',
            'no-lone-blocks': 'error',
            'no-loop-func': 'error',
            'no-magic-numbers': [
                'error',
                {
                    ignore: [-1, 0, 1, 2]
                }
            ],
            'no-param-reassign': 'error',
            'no-prototype-builtins': 0,
            'no-return-assign': ['error', 'always'],
            'no-script-url': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unused-expressions': 'error',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'no-void': 'error',
            'no-with': 'error',

            /**
             * Stylistic rules
             */

            camelcase: 'error',
            'comma-dangle': [
                'error',
                'never'
            ],
            complexity: 'error',
            curly: [
                'error',
                'all'
            ],
            indent: [
                'error',
                4, // http://eslint.org/docs/rules/indent
                {
                    SwitchCase: 1
                }
            ],
            'max-depth': [
                'error',
                3  // http://eslint.org/docs/rules/max-depth
            ],
            'new-cap': 'error',
            'new-parens': 'error',
            'no-continue': 'error',
            'no-lonely-if': 'error',
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1
                }
            ],
            'no-nested-ternary': 'error',
            'no-tabs': 'error',
            'no-trailing-spaces': [
                'error',
                {
                    ignoreComments: true,
                    skipBlankLines: true
                }
            ],
            'no-unneeded-ternary': 'error',
            'no-unused-private-class-members': 'off',
            'no-unused-vars': ['error', {
                'vars': 'all',
                'args': 'all',
                'argsIgnorePattern': '^__',
                'varsIgnorePattern': '^__',
                'caughtErrorsIgnorePattern': '^__'
            }],
            'nonblock-statement-body-position': [
                'error',
                'beside'  // http://eslint.org/docs/rules/nonblock-statement-body-position
            ],
            'one-var-declaration-per-line': [
                'error',
                'always'
            ],
            quotes: [
                'error',
                'single'
            ],
            semi: [
                'error',
                'always'
            ],
            'vars-on-top': 'error',
            
            /**
             * Depend Rules
             */
            'depend/ban-dependencies': 'warn',

            /**
             * JSdoc Rules
             */
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/tag-lines': 'off',

            /**
             * ES6 Specific
             */

            'arrow-body-style': [
                'error',
                'as-needed'
            ],
            'no-confusing-arrow': 'error',
            'no-useless-constructor': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-template': 'error'
        }
    }
];