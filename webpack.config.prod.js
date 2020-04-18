const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

module.exports = {
  entry: [path.join(__dirname, "src/components.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd", // Configuring the library target
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"],
        },
      },
      // {
      //   test: /\.scss$/,
      //   loader: "css-loader",
      //   options: {
      //     modules: true
      //   }
      // },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "cssimportant-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")],
            },
          },
          {
            loader: "sass-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "cssimportant-loader"],
      },
    ],
  },
  plugins: [
    // htmlWebpackPlugin,
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.7,
    }),
    new BrotliPlugin({
      asset: "[path].br[query]",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.7,
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  node: {
    fs: "empty",
  },
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 650000,
  },
  externals: "react",
  optimization: {
    minimize: false,
  },
};
