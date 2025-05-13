const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // 确保 .tsx 文件被正确处理
    config.module
      .rule("tsx")
      .test(/\.tsx$/)
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("ts-loader")
      .loader("ts-loader")
      .options({
        transpileOnly: true,
        appendTsSuffixTo: [/\.vue$/],
      })
      .end();
  },
});
