import babel from "rollup-plugin-babel";
import babelMinify from "rollup-plugin-babel-minify";

export default {
	input: "src/index.js",
	output: {
		file: "dist/bot.js",
		format: "cjs"
	},
	plugins: [
		babel({
			// only transpile our source code:
			exclude: "node_modules/**"
		}),
		babelMinify()
	]
};
