const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "public/index.html"),
  filename: "./index.html"
});

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: [path.join(__dirname, "src/index.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.min.js"
  },
  watchOptions: {
    ignored: "/node_modules/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "react-refresh/babel"
          ]
        }
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"]
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
              disable: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  devServer: {
    hot: true,
    port: 3000
  },
  plugins: [htmlWebpackPlugin, new ReactRefreshWebpackPlugin()],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  node: {
    fs: "empty"
  }
};
