import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslintConfigPrettier,
    {
        files: ['**/*.{ts,mts,cts}'],
        plugins: { js, prettier: eslintPluginPrettier },
        extends: ['js/recommended'],
        rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }] }
    },
    {
        files: ['**/*.{ts,mts,cts}'],
        languageOptions: { globals: globals.browser }
    },
    tseslint.configs.recommended
]);
