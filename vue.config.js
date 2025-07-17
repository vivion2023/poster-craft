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

    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 300 * 1024,
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // 确保 module.context 存在
            if (!module.context) {
              return "vendor";
            }

            // 匹配 node_modules 中的包名
            const match = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );

            if (!match || !match[1]) {
              return "vendor";
            }

            const packageName = match[1];
            // 处理 scoped packages (如 @vue/xxx)
            return `npm.${packageName.replace("@", "")}`;
          },
        },
      },
    };
  },
});
