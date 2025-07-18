# 🎨 Poster Craft

一个基于 Vue 3 + TypeScript 的 H5 可视化海报编辑器，支持拖拽组件、实时预览、撤销重做、图片处理、快捷键操作和画布发布等功能。

## ✨ 功能特性

- 🎯 **可视化编辑**: 拖拽式组件编辑，所见即所得
- 📱 **移动端适配**: 响应式设计，完美适配各种屏幕尺寸
- 🔄 **撤销重做**: 完整的历史记录系统，支持无限次撤销重做
- 🖼️ **图片处理**: 集成 Cropper.js，支持图片裁剪和处理
- ⌨️ **快捷键支持**: 丰富的快捷键操作，提升编辑效率
- 🎨 **画布渲染**: 基于 HTML2Canvas 的高质量画布导出
- 🚀 **独立预览**: 独立的 H5 预览服务，支持分享和嵌入
- 📦 **组件化**: 基于 lego-components 的可扩展组件系统

## 🛠️ 技术栈

### 前端框架

- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vue Router 4**: 官方路由管理器
- **Vuex 4**: 状态管理模式

### UI 组件库

- **Ant Design Vue 4**: 企业级 UI 设计语言
- **@ant-design/icons-vue**: 图标组件库

### 核心功能库

- **vuedraggable**: 拖拽排序组件
- **cropperjs**: 图片裁剪处理
- **html2canvas**: 画布截图生成
- **hotkeys-js**: 快捷键绑定
- **qrcode.vue**: 二维码生成

### 开发工具

- **Vue CLI 5**: 标准工具链
- **Jest**: 单元测试框架
- **ESLint + Prettier**: 代码规范和格式化
- **Sass**: CSS 预处理器

## 📁 项目结构

```
poster-craft/
├── src/                          # 源代码目录
│   ├── components/               # 公共组件
│   ├── view/                     # 页面组件
│   ├── store/                    # Vuex 状态管理
│   ├── router/                   # 路由配置
│   ├── plugins/                  # 插件配置
│   ├── hooks/                    # 组合式 API
│   └── types/                    # TypeScript 类型定义
├── h5-server/                    # H5 预览服务
│   ├── server.js                 # Express 服务器
│   ├── public/                   # 静态资源
│   └── package.json              # 服务依赖配置
├── fake-server/                  # 模拟后端服务
├── tests/                        # 测试文件
└── public/                       # 静态资源
```

## 🔗 相关链接

- [Vue 3 文档](https://v3.vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Vue CLI 配置参考](https://cli.vuejs.org/config/)
- [TypeScript 文档](https://www.typescriptlang.org/)
