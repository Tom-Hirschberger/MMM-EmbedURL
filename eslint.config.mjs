import eslintPluginJs from "@eslint/js"
import eslintPluginStylistic from "@stylistic/eslint-plugin"
import globals from "globals"

const config = [
	{
		files: ["**/*.js", "**/*.mjs"],
	},
	{
		ignores: ["**/doc/configs/webcam-config.js"],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				Log: "readonly",
				Module: "readonly",
			},
		},
		plugins: {
			...eslintPluginStylistic.configs["recommended-flat"].plugins,
		},
		rules: {
			...eslintPluginJs.configs.all.rules,
			...eslintPluginStylistic.configs["recommended-flat"].rules,
			"@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"@stylistic/comma-dangle": ["error", "only-multiline"],
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/max-statements-per-line": ["error", { max: 2 }],
			"@stylistic/no-tabs": "off",
			"@stylistic/quotes": ["error", "double"],
			"capitalized-comments": "off",
			"complexity": "off",
			"consistent-this": "off",
			"eqeqeq": "warn",
			"init-declarations": "off",
			"max-depth": "off",
			"max-lines": "off",
			"max-lines-per-function": "off",
			"max-params": "off",
			"max-statements": ["error", { max: 80 }],
			"no-else-return": "off",
			"no-eq-null": "warn",
			"no-inline-comments": "off",
			"no-magic-numbers": "off",
			"no-negated-condition": "off",
			"no-param-reassign": "off",
			"no-plusplus": "off",
			"no-useless-assignment": "warn",
			"one-var": "off",
			"prefer-destructuring": "off",
			"sort-keys": "off",
		},
	}
]

export default config
