const path = require("path");
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");

module.exports = {
  entry: [path.join(__dirname, "src/components.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "PelcroReactElements",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"]
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          "cssimportant-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")]
            }
          },
          {
            loader: "sass-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "cssimportant-loader"]
      }
    ]
  },
  plugins: [new EsmWebpackPlugin()],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  node: {
    fs: "empty"
  },
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 650000
  },
  externals: "react",
  optimization: {
    minimize: false
  }
};
