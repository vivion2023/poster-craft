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

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
# 启动主应用 (http://localhost:8080)
npm run serve

# 启动模拟后端服务 (http://localhost:3000)
npm run mock

# 启动 H5 预览服务 (http://localhost:8082)
npm run h5:dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查和格式化

```bash
# 检查并修复代码
npm run lint

# 运行单元测试
npm run test:unit

# 监听模式运行测试
npm run test:watch
```

## 🎯 H5 预览服务

项目包含一个独立的 H5 预览服务，用于渲染和分享海报作品。

### 安装 H5 服务依赖

```bash
npm run h5:install
```

### 启动 H5 服务

```bash
# 开发模式（自动重启）
npm run h5:dev

# 生产模式
npm run h5
```

### 访问预览

预览 URL 格式：`http://localhost:8082/p/preview/{workId}-{uuid}`

详细使用说明请参考：[H5 预览服务指南](./h5-server/H5_PREVIEW_GUIDE.md)

## 📝 开发指南

### 组件开发

项目使用 Vue 3 Composition API 和 TypeScript，推荐使用 `<script setup>` 语法：

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const doubleCount = computed(() => count.value * 2);
</script>
```

### 状态管理

使用 Vuex 4 进行状态管理，主要模块包括：

- `editor`: 编辑器状态和组件数据
- `user`: 用户信息和认证状态
- `templates`: 模板数据管理
- `global`: 全局状态（加载、错误等）

### 快捷键配置

项目支持丰富的快捷键操作：

- `Ctrl+Z`: 撤销
- `Ctrl+Y`: 重做
- `Ctrl+C`: 复制组件
- `Delete/Backspace`: 删除组件
- `Ctrl+S`: 保存作品

## 📦 部署

### 构建应用

```bash
npm run build
```

### 部署 H5 预览服务

```bash
cd h5-server
npm install
npm start
```

建议在生产环境中使用 PM2 等进程管理工具。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 🔗 相关链接

- [Vue 3 文档](https://v3.vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Vue CLI 配置参考](https://cli.vuejs.org/config/)
- [TypeScript 文档](https://www.typescriptlang.org/)
