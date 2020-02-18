const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "public/index.html"),
  filename: "./index.html"
});

module.exports = {
  entry: [path.join(__dirname, "src/components.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.min.js",
    libraryTarget: "commonjs2"
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
      // {
      //   test: /\.scss$/,
      //   use: [
      //     "style-loader",
      //     "css-loader",
      //     "cssimportant-loader",
      //     "postcss-loader",
      //     "sass-loader"
      //   ]
      // },
      {
        test: /\.scss$/,
        loader: "css-loader",
        options: {
          modules: true
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "cssimportant-loader"]
      }
    ]
  },
  plugins: [
    // htmlWebpackPlugin,
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.7
    }),
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.7
    })
  ],
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
