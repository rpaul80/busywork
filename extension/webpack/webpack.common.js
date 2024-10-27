const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
  entry: {
    sidebar: path.join(srcDir, "components", "Sidebar.tsx"),
    options: path.join(srcDir, "options.tsx"),
    "service-worker": path.join(srcDir, "service-worker.ts"),
    content_script: path.join(srcDir, "content_script.tsx"),
    content_styles: path.join(srcDir, "content_styles.css"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: ".", to: "../", context: "public" },
        { from: "*.css", to: "../css", context: srcDir },
      ],
      options: {},
    }),
  ],
};
