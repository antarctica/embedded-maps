import { FlatCompat } from '@eslint/eslintrc';
import panda from '@pandacss/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { config, configs as tsConfigs } from 'typescript-eslint';

const compat = new FlatCompat();

export default config(
  // ignore
  {
    name: 'ignores',
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'styled-system/**/*',
      'node_modules',
      'dist',
      'public/arcgis',
    ],
  },
  // react
  {
    ...pluginReact.configs.flat['jsx-runtime'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // react hooks
  {
    extends: [...compat.config(reactHooks.configs.recommended)],
  },

  // react compiler:
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'warn',
    },
  },

  // react refresh
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // typescript
  {
    extends: [...tsConfigs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
  },
  // simple import sort
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // pandacss rules
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    ignores: ['**/*.d.ts', 'styled-system'],
    plugins: {
      '@pandacss': panda,
    },
    rules: {
      ...panda.configs.recommended.rules,
      '@pandacss/no-debug': 'off',
      '@pandacss/no-margin-properties': 'off',
      '@pandacss/no-hardcoded-color': ['error', { noOpacity: true }],
    },
  },

  // eslint-plugin-prettier -- all prettier rules before this are ignored
  eslintPluginPrettierRecommended,
);
