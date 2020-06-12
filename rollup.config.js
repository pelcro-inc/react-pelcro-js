import del from "rollup-plugin-delete";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  {
    input: "src/components.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "esm" }
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
          "transform-react-remove-prop-types"
        ],
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
      commonjs({
        include: "node_modules/**",
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        namedExports: {
          "node_modules/react/index.js": [
            "cloneElement",
            "createContext",
            "Component",
            "createElement"
          ],
          "node_modules/react-dom/index.js": ["render", "hydrate"],
          "node_modules/react-is/index.js": [
            "isElement",
            "isValidElementType",
            "ForwardRef",
            "typeOf"
          ]
        }
      }),
      terser(),
      del({ targets: ["dist/*", "playground/src/component-lib"] }),

      json()
    ],
    external: ["react", "prop-types"],
    globals: { "styled-components": "styled" }
  }
];
