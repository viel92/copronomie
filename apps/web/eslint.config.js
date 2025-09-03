import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript'
    ],
  }),
  {
    rules: {
      // Désactiver certaines règles trop strictes pour la phase de développement
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // Règles Next.js importantes
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'out/**',
    ]
  }
]