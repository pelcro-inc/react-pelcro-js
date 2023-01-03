import del from "rollup-plugin-delete";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import visualizer from "rollup-plugin-visualizer";
import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import postcss from "rollup-plugin-postcss";
import path from "path";

export default [
  {
    input: "src/components.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "esm" }
    ],
    plugins: [
      url(),
      svgr({
        svgoConfig: {
          plugins: [{ prefixIds: false }]
        }
      }),
      resolve(),
      external(),
      postcss({
        extract: path.resolve("dist/pelcro.css")
      }),
      babel({
        presets: ["react-app"],
        plugins: [
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
          "node_modules/react-is/index.js": [
            "isElement",
            "isValidElementType",
            "ForwardRef",
            "typeOf"
          ],
          "node_modules/@stripe/stripe-js/pure.js": ["loadStripe"]
        }
      }),
      del({ targets: ["dist/*"] }),
      json(),
      visualizer({
        gzipSize: true,
        open: true
      })
    ]
  }
];
