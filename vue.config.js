const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(tsx|jsx)$/,
          use: ["babel-loader"],
        },
      ],
    },
    plugins: [new BundleAnalyzerPlugin()],
  },
});
