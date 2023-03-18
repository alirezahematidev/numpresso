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
      "@/helpers": path.resolve(__dirname, "src/helpers"),
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
    globalObject: "this",
  },
};
