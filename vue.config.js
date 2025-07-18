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

    // 优化 Tree Shaking
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    // 配置模块解析，优化 Ant Design Vue 的导入
    config.resolve.alias = {
      ...config.resolve.alias,
      "ant-design-vue/es": "ant-design-vue/es",
      "ant-design-vue/lib": "ant-design-vue/es",
    };

    // 生产环境下启用更多优化
    if (process.env.NODE_ENV === "production") {
      // 启用 gzip 压缩优化
      config.optimization.minimize = true;

      // 优化模块合并
      config.optimization.concatenateModules = true;

      // 移除未使用的代码
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 100 * 1024, // 降低最小包大小到 100KB
      chunks: "all",
      cacheGroups: {
        // Vue 核心库单独分包
        vue: {
          test: /[\\/]node_modules[\\/](vue|@vue)[\\/]/,
          name: "vue-core",
          priority: 30,
          chunks: "all",
        },
        // Ant Design Vue 单独分包
        antd: {
          test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
          name: "antd-vue",
          priority: 25,
          chunks: "all",
        },
        // Ant Design Icons 单独分包
        antdIcons: {
          test: /[\\/]node_modules[\\/]@ant-design[\\/]icons-vue[\\/]/,
          name: "antd-icons",
          priority: 24,
          chunks: "all",
        },
        // 其他大型库单独分包
        lodash: {
          test: /[\\/]node_modules[\\/]lodash(-es)?[\\/]/,
          name: "lodash",
          priority: 20,
          chunks: "all",
        },
        // 其他第三方库
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
          priority: 10,
          chunks: "all",
        },
      },
    };
  },
});
