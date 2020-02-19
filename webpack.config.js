const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "public/index.html"),
  filename: "./index.html"
});

module.exports = {
  entry: [path.join(__dirname, "src/index.js")],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.min.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["ie 9"]
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "cssimportant-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    htmlWebpackPlugin,
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
    }),
    new RemovePlugin({
      after: {
        test: [
          {
            folder: "dist/",
            method: filePath => {
              return new RegExp(/\.html$/, "m").test(filePath);
            },
            recursive: true
          }
        ]
      }
    }),
    new CopyPlugin([{ from: "src/images", to: "images" }])
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
  }
};
