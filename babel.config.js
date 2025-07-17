module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset", //  Vue CLI 的 默认Babel 预设
    ["@babel/preset-typescript", { isTSX: true, allExtensions: true }], //  TypeScript 预设
  ],
  plugins: ["@vue/babel-plugin-jsx"], //  Vue 的 JSX 插件
};
