const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 2001,
    open: true,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    watchFiles: ["src/**/*", "!src/scripts/sw-template.js"], // jangan watch file sw-template
  },
  infrastructureLogging: {
    level: "warn",
  },
});

