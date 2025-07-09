# H5 预览服务使用指南

## 概述

我已经为你创建了一个完整的 H5 预览服务，用于在 `http://localhost:8082` 上独立渲染海报作品的 canvas 效果。

## 🚀 快速开始

### 1. 安装 H5 服务器依赖

```bash
# 方法一：使用主项目脚本（推荐）
npm run h5:install

# 方法二：手动安装
cd h5-server
npm install
```

### 2. 启动服务

```bash
# 开发模式（自动重启）
npm run h5:dev

# 生产模式
npm run h5

# 或者在 h5-server 目录下直接运行
cd h5-server
npm run dev    # 开发模式
npm start      # 生产模式
```

### 3. 访问预览

服务启动后，你可以通过以下格式访问预览页面：

```
http://localhost:8082/p/{workId}-{uuid}
```

例如：`http://localhost:8082/p/123-abc123def456`

## 📁 项目结构

```
h5-server/
├── package.json          # 项目配置和依赖
├── server.js             # Express 服务器主文件
├── install.js            # 依赖安装脚本
├── public/               # 静态资源目录
│   ├── index.html        # 服务首页
│   └── preview.html      # 预览页面模板
├── README.md            # 详细说明文档
└── .gitignore           # Git 忽略文件
```

## 🎯 功能特性

### ✨ 完美的 Canvas 渲染
- 完全还原编辑器中的 canvas 效果
- 支持文本组件（l-text）和图片组件（l-image）
- 自动处理组件样式和定位

### 📱 响应式设计
- 移动端友好的预览界面
- 现代化的 UI 设计
- 优雅的加载和错误状态

### 🔧 独立部署
- 与主应用完全分离
- 可独立部署到任何服务器
- 支持跨域访问

## 🛠 技术实现

### 服务端 (server.js)
- **Express**: Web 框架
- **CORS**: 跨域支持
- **Axios**: HTTP 客户端，用于获取作品数据

### 前端 (preview.html)
- **原生 JavaScript**: 无框架依赖
- **Fetch API**: 异步数据获取
- **CSS3**: 现代化样式和动画

## 📡 API 接口

### 1. 预览页面路由
```
GET /p/:workId-:uuid
```
返回渲染好的预览页面 HTML。

### 2. 作品数据接口
```
GET /api/work/:workId
```
获取指定作品的数据，供预览页面使用。

**响应格式：**
```json
{
  "errno": 0,
  "data": {
    "id": 123,
    "title": "我的海报",
    "desc": "这是一个很棒的海报",
    "content": {
      "components": [
        {
          "name": "l-text",
          "props": {
            "text": "Hello World",
            "fontSize": "24px",
            "color": "#333",
            "position": "absolute",
            "top": "100px",
            "left": "50px"
          }
        }
      ],
      "props": {
        "height": "560px",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

## 🎨 组件支持

### 文本组件 (l-text)
支持的样式属性：
- `text`: 文本内容
- `fontSize`: 字体大小
- `color`: 文字颜色
- `fontWeight`: 字体粗细
- `textAlign`: 文本对齐
- `position`: 定位方式
- `top`, `left`, `right`, `bottom`: 位置

### 图片组件 (l-image)
支持的样式属性：
- `src`: 图片地址
- `alt`: 替代文本
- `width`, `height`: 尺寸
- `position`: 定位方式
- `top`, `left`, `right`, `bottom`: 位置

## 🔄 与主应用的集成

### 发布作品时的 URL 生成
当你在主应用中发布作品时，系统会自动生成预览 URL：

```javascript
// 在 fake-server/mockServer.js 中
const publishUrl = `${baseUrl}/p/${workId}-${work.uuid || Date.now()}`;
```

### 截图功能的本地化
已经修改了截图上传功能，使其使用本地路径而不是远程 URL：

```javascript
// 修改前：使用远程 URL
// screenshotUrl.value = resp.data.urls[0];

// 修改后：使用本地 URL
screenshotUrl.value = resp.data.url;
```

## 🚀 部署建议

### 开发环境
1. 启动后端 API 服务：`npm run mock`
2. 启动主应用：`npm run serve`
3. 启动 H5 预览服务：`npm run h5:dev`

### 生产环境
1. 使用 PM2 管理进程
2. 配置 Nginx 反向代理
3. 设置 HTTPS 证书

## 🔍 故障排除

### 常见问题

1. **预览页面显示"作品不存在"**
   - 检查后端 API 服务是否正常运行
   - 确认作品 ID 是否正确

2. **样式显示异常**
   - 检查组件数据格式是否正确
   - 确认 CSS 属性值是否有效

3. **图片无法显示**
   - 检查图片 URL 是否可访问
   - 确认跨域设置是否正确

### 调试方法
- 打开浏览器开发者工具查看控制台错误
- 检查网络请求是否成功
- 查看服务器日志输出

## 📞 技术支持

如果遇到问题，请检查：
1. Node.js 版本是否兼容
2. 端口 8082 是否被占用
3. 后端 API 服务是否正常运行
4. 网络连接是否正常

现在你可以开始使用 H5 预览服务了！🎉
