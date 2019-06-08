const path = require("path");
const webpack = require("webpack");

module.exports = {
  target: "node",
  mode: "production",
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] }]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^mqtt$/, "mqtt/dist/mqtt.js")
  ]
};
