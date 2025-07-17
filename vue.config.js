const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { defineConfig } = require("@vue/cli-service");
const isAnalyzeMode = !!process.env.ANALYZE_MODE;

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: (config) => {
    // 配置 JSX/TSX 支持
    config.module.rules.push({
      test: /\.(tsx|jsx)$/,
      use: ["babel-loader"],
    });

    // 只在分析模式下添加 BundleAnalyzerPlugin
    if (isAnalyzeMode) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  },
});
