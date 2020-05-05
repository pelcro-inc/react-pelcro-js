import del from "rollup-plugin-delete";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import postcssModules from "postcss-modules";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const cssExportMap = {};

export default [
  {
    input: "src/components.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "esm" },
    ],
    plugins: [
      resolve(),
      babel({
        presets: ["react-app"],
        plugins: [
          "@babel/plugin-proposal-object-rest-spread",
          "@babel/plugin-proposal-optional-chaining",
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-proposal-class-properties",
          "transform-react-remove-prop-types",
        ],
        exclude: "node_modules/**",
        runtimeHelpers: true,
      }),
      commonjs(),
      terser(),
      del({ targets: ["dist/*", "playground/src/component-lib"] }),

      json(),
    ],
    external: ["react", "prop-types"],
  },
];
