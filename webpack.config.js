const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/core": path.resolve(__dirname, "src/core"),
      "@/types": path.resolve(__dirname, "src/types"),
    },
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "myLibrary",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
};
