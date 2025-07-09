# H5 预览服务

这是一个独立的 H5 预览服务，用于在 `http://localhost:8082` 上渲染海报作品的 canvas 效果。

## 功能特性

- 🎨 **Canvas 渲染**: 完美还原编辑器中的 canvas 效果
- 📱 **移动端适配**: 响应式设计，适配各种屏幕尺寸
- 🚀 **独立服务**: 与主应用分离，可独立部署
- 🎯 **SEO 友好**: 服务端渲染，支持搜索引擎抓取
- 💫 **美观界面**: 现代化的预览界面设计

## 安装依赖

```bash
cd h5-server
npm install
```

## 启动服务

### 开发模式（自动重启）

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

### 从主项目启动

```bash
# 在主项目根目录执行
npm run h5        # 生产模式
npm run h5:dev    # 开发模式
```

## 访问地址

- 服务地址: `http://localhost:8082`
- 预览 URL 格式: `http://localhost:8082/p/preview/{workId}-{uuid}`

## API 接口

### GET /p/preview/:workId-:uuid

预览页面路由，返回渲染好的 HTML 页面。

**参数:**

- `workId`: 作品 ID
- `uuid`: 作品唯一标识

**示例:**

```
http://localhost:8082/p/preview/123-abc123def456
```

### GET /api/work/:workId

获取作品数据的 API 接口。

**参数:**

- `workId`: 作品 ID

**响应格式:**

```json
{
  "errno": 0,
  "data": {
    "id": 123,
    "title": "我的海报",
    "desc": "这是一个很棒的海报",
    "content": {
      "components": [...],
      "props": {...}
    }
  },
  "message": "success"
}
```

## 技术栈

- **Node.js**: 服务端运行环境
- **Express**: Web 框架
- **CORS**: 跨域支持
- **Axios**: HTTP 客户端

## 目录结构

```
h5-server/
├── package.json          # 项目配置
├── server.js             # 服务器主文件
├── public/               # 静态资源
│   └── preview.html      # 预览页面模板
└── README.md            # 说明文档
```

## 开发说明

### 组件支持

目前支持以下组件类型的渲染：

- **l-text**: 文本组件
- **l-image**: 图片组件

### 样式处理

支持以下 CSS 属性的自动转换：

- 尺寸属性: `fontSize`, `width`, `height`, `top`, `left`, `right`, `bottom`
- 颜色属性: `color`, `backgroundColor`, `borderColor`
- 文本属性: `fontWeight`, `textAlign`, `textDecoration`, `fontStyle`
- 定位属性: `position`

### 扩展组件

要添加新的组件类型支持，请在 `preview.html` 的 `generateComponentsHTML` 函数中添加相应的处理逻辑。

## 部署说明

1. 确保 Node.js 环境已安装
2. 安装项目依赖: `npm install`
3. 启动服务: `npm start`
4. 配置反向代理（如 Nginx）指向 8082 端口

## 注意事项

- 确保后端 API 服务（localhost:3000）正常运行
- 预览页面会自动从后端获取作品数据
- 支持跨域访问，可以嵌入到其他页面中
- 建议在生产环境中使用 PM2 等进程管理工具
