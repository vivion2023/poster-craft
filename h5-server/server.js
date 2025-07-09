const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 8082;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 预览页面路由 - 匹配 /p/:workId-:uuid 格式
app.get("/p/:workId-:uuid", (req, res) => {
  const { workId, uuid } = req.params;
  console.log(`预览请求: workId=${workId}, uuid=${uuid}`);

  // 直接返回预览页面，让前端JavaScript处理数据加载
  res.sendFile(path.join(__dirname, "public", "preview.html"));
});

// API路由 - 获取作品数据（供预览页面调用）
app.get("/api/work/:workId", async (req, res) => {
  try {
    const { workId } = req.params;
    console.log(`API请求作品数据: workId=${workId}`);

    // 从后端API获取作品数据
    // 注意：现在后端已经允许公开访问作品详情，所以不需要token
    const response = await axios.get(
      `http://localhost:3000/api/works/${workId}`
    );
    const result = response.data;

    // 直接返回后端API的响应
    res.json(result);
  } catch (error) {
    console.error("获取作品数据失败:", error.message);

    // 如果是401错误，说明需要登录，返回更友好的错误信息
    if (error.response && error.response.status === 401) {
      res.status(200).json({
        errno: 1,
        message: "作品访问需要登录，请检查后端服务配置",
        data: null,
      });
    } else {
      res.status(500).json({
        errno: 1,
        message: "获取作品数据失败: " + error.message,
        data: null,
      });
    }
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`H5预览服务已启动: http://localhost:${PORT}`);
  console.log(`预览URL格式: http://localhost:${PORT}/p/{workId}-{uuid}`);
});
