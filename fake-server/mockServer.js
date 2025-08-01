// @ts-nocheck
const jsonServer = require("json-server");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router(__dirname + "/db.json");
const middlewares = jsonServer.defaults();
const SECRET_KEY = "1234567890"; //密钥
const expiresIn = "1h"; //过期时间
const templateData = require("./template.json");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// 内存存储验证码，格式：{ phoneNumber: { code: '1234', timestamp: 1234567890 } }
const veriCodeStore = new Map();
const VERI_CODE_EXPIRE_TIME = 5 * 60 * 1000; // 验证码5分钟过期

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

// 清理过期的验证码
function cleanExpiredVeriCodes() {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [phoneNumber, data] of veriCodeStore.entries()) {
    if (now - data.timestamp > VERI_CODE_EXPIRE_TIME) {
      veriCodeStore.delete(phoneNumber);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`清理了 ${cleanedCount} 个过期验证码`);
  }
}

// 定期清理过期验证码 - 每5分钟执行一次
setInterval(cleanExpiredVeriCodes, 5 * 60 * 1000);

const rewriter = jsonServer.rewriter({
  "/api/*": "/$1",
});
server.use(bodyParser.json());
server.use(rewriter);
server.use(middlewares);

// 创建上传目录，如果不存在
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// 静态服务：供外部访问上传后的图片
const express = require("express");
server.use("/uploads", express.static(uploadDir));

// 用户登录
server.post("/users/loginByPhoneNumber", (req, res) => {
  const { phoneNumber, veriCode } = req.body.data;
  console.log("登录请求: ", phoneNumber, veriCode);
  if (!phoneNumber || !veriCode) {
    return res.status(200).jsonp({
      errno: 12001,
      message: "手机号和验证码不能为空",
    });
  }

  // 清理过期验证码
  cleanExpiredVeriCodes();

  // 检查验证码是否存在
  const storedVeriCodeData = veriCodeStore.get(phoneNumber);
  if (!storedVeriCodeData) {
    // 如果验证码不存在或已过期，但是手机号格式正确，仍然允许登录
    // 这样可以支持有token的情况下直接登录
    console.log("验证码不存在或已过期，但允许登录: ", phoneNumber);
  } else {
    // 验证验证码是否正确（只有在验证码存在时才验证）
    if (storedVeriCodeData.code !== veriCode.toString()) {
      return res.status(200).jsonp({
        errno: 12003,
        message: "验证码错误",
      });
    }
    // 验证码使用后删除（一次性使用）
    veriCodeStore.delete(phoneNumber);
  }

  const accessToken = createToken({ phoneNumber });
  res.status(200).jsonp({
    errno: 0,
    data: {
      token: accessToken,
    },
    message: "登录成功",
  });
});

// Token验证登录（用于有token时直接登录）
server.post("/users/loginByToken", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(200).jsonp({
      errno: 12005,
      message: "Token不能为空",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    console.log("Token验证成功: ", decoded);

    res.status(200).jsonp({
      errno: 0,
      data: {
        token: token,
      },
      message: "登录成功",
    });
  } catch (error) {
    console.log("Token验证失败: ", error.message);
    res.status(200).jsonp({
      errno: 12006,
      message: "登录信息已过期，请重新登录",
    });
  }
});

// Token验证登录（用于有token时直接登录）
server.post("/users/loginByToken", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(200).jsonp({
      errno: 12005,
      message: "登录信息不能为空",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    console.log("Token验证成功: ", decoded);

    res.status(200).jsonp({
      errno: 0,
      data: {
        token: token,
      },
      message: "登录成功",
    });
  } catch (error) {
    console.log("Token验证失败: ", error.message);
    res.status(200).jsonp({
      errno: 12006,
      message: "登录信息已过期，请重新登录",
    });
  }
});

// 获取验证码（不需要认证）
server.post("/users/genVeriCode", (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(200).jsonp({
      errno: 12004,
      message: "手机号不能为空",
    });
  }

  // 清理过期验证码
  cleanExpiredVeriCodes();

  const veriCode = Math.floor(Math.random() * 9000 + 1000);

  // 存储验证码到内存
  veriCodeStore.set(phoneNumber, {
    code: veriCode.toString(),
    timestamp: Date.now(),
  });

  return res.status(200).jsonp({
    errno: 0,
    data: { veriCode },
    message: "验证码获取成功",
  });
});

// 获取模板列表（不需要认证，添加延迟模拟loading）
server.get("/templates", (req, res) => {
  // 新增：处理分页参数
  const { pageIndex = 0, pageSize = 4 } = req.query;
  const pageIndexNum = parseInt(pageIndex, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  const start = pageIndexNum * pageSizeNum;
  const end = start + pageSizeNum;
  const paginatedList = templateData.list.slice(start, end);
  // 添加3秒延迟来查看loading效果
  setTimeout(() => {
    res.status(200).jsonp({
      errno: 0,
      data: {
        list: paginatedList,
        count: templateData.list.length,
      },
      message: "获取模板列表成功",
    });
  }, 100); // 3秒延迟
});

server.use((req, res, next) => {
  const errorResp = {
    errno: 12005,
    message: "登录校验失败",
  };

  const authHeader = req.headers.authorization;
  // 以下接口不需要登录校验
  const publicPaths = [
    "/utils/upload-img",
    "/utils/upload-local-img",
    "/works/", // 允许访问作品详情（用于预览）
  ];

  // 检查是否是公开接口
  const isPublicPath = publicPaths.some((path) => req.path.startsWith(path));
  if (isPublicPath) {
    next();
    return;
  }
  if (authHeader === undefined) {
    res.jsonp(errorResp);
    return;
  }
  try {
    verifyToken(authHeader.split(" ")[1]);
    next();
  } catch {
    res.jsonp(errorResp);
    return;
  }
});

// 获取用户信息（需要认证）
server.get("/users/getUserInfo", (req, res) => {
  res.status(200).jsonp({
    errno: 0,
    data: {
      username: "13612344324",
      id: 1,
      phoneNumber: "13612344324",
      nickName: "vivion",
      description: "测试用户",
      updatedAt: "2025-06-25 10:00:00",
      createdAt: "2025-06-25 10:00:00",
      iat: 1719369600,
      exp: 1719373200,
      picture: "https://picsum.photos/200/300",
      gender: "0",
    },
    message: "获取用户信息成功",
  });
});

// 新增作品（需要身份验证）
server.post("/works", (req, res) => {
  // ① 可选：校验登录
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).jsonp({ errno: 14001, message: "未登录" });
  }
  try {
    verifyToken(authHeader.split(" ")[1]);
  } catch {
    return res.status(401).jsonp({ errno: 14002, message: "登录失效" });
  }

  // ② 读取并校验请求体
  const { title, desc, coverImg } = req.body;
  if (!title || !desc || !coverImg) {
    return res.status(200).jsonp({
      errno: 14003,
      message: "标题、描述和封面不能为空",
    });
  }

  // ③ 生成新作品数据
  const worksDB = router.db.get("works"); // 假设 db.json 里有 "works": []
  const newId = Date.now(); // 简单生成唯一 ID
  const newWork = {
    id: newId,
    title,
    desc,
    coverImg,
    copiedCount: 0,
    isTemplate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // ④ 写入数据库并返回结果
  worksDB.push(newWork).write();
  return res.status(200).jsonp({
    errno: 0,
    data: newWork,
    message: "作品创建成功",
  });
});

// 上传图片接口（不需要认证）
server.post("/utils/upload-img", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .jsonp({ errno: 15001, message: "没有检测到上传文件" });
  }
  const file = req.files[0];
  const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
  return res.status(200).jsonp({
    errno: 0,
    data: { url: fileUrl },
    message: "上传成功",
  });
});

// 本地图片上传接口（不需要认证）
server.post("/utils/upload-local-img", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .jsonp({ errno: 15001, message: "没有检测到上传文件" });
  }
  const file = req.files[0];
  const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
  return res.status(200).jsonp({
    errno: 0,
    data: { url: fileUrl },
    message: "上传成功",
  });
});

// 通用发布函数
function publishWork(req, res, isTemplate = false) {
  // ① 校验登录
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).jsonp({ errno: 14001, message: "未登录" });
  }
  try {
    verifyToken(authHeader.split(" ")[1]);
  } catch {
    return res.status(401).jsonp({ errno: 14002, message: "登录失效" });
  }

  // ② 获取作品ID
  const workId = req.params.id;
  if (!workId) {
    return res.status(400).jsonp({ errno: 14004, message: "作品ID不能为空" });
  }

  // ③ 检查作品是否存在
  const worksDB = router.db.get("works");
  const work = worksDB.find({ id: parseInt(workId) }).value();
  if (!work) {
    return res.status(404).jsonp({ errno: 14005, message: "作品不存在" });
  }

  // ④ 生成发布URL
  const baseUrl = "http://localhost:8082"; // H5预览地址
  const publishUrl = `${baseUrl}/p/${workId}-${work.uuid || Date.now()}`;

  // ⑤ 更新作品状态
  const updateData = {
    status: 2, // 已发布状态
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // 如果是发布为模板，则添加到模板表
  if (isTemplate) {
    updateData.isTemplate = true;
    const templatesDB = router.db.get("templates");
    const templateData = {
      ...work,
      ...updateData,
      id: Date.now(), // 模板使用新的ID
      originalWorkId: work.id, // 记录原作品ID
    };
    templatesDB.push(templateData).write();
  }

  // 更新原作品
  worksDB
    .find({ id: parseInt(workId) })
    .assign(updateData)
    .write();

  // ⑥ 返回发布结果
  return res.status(200).jsonp({
    errno: 0,
    data: { url: publishUrl },
    message: isTemplate ? "发布为模板成功" : "作品发布成功",
  });
}

// 发布作品接口
server.post("/works/publish/:id", (req, res) => {
  return publishWork(req, res, false);
});

// 发布为模板接口
server.post("/works/publish-template/:id", (req, res) => {
  return publishWork(req, res, true);
});

// 获取作品渠道接口
server.get("/channel/getWorkChannels/:id", (req, res) => {
  // ① 校验登录
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).jsonp({ errno: 14001, message: "未登录" });
  }
  try {
    verifyToken(authHeader.split(" ")[1]);
  } catch {
    return res.status(401).jsonp({ errno: 14002, message: "登录失效" });
  }

  // ② 获取作品ID
  const workId = req.params.id;
  if (!workId) {
    return res.status(400).jsonp({ errno: 14004, message: "作品ID不能为空" });
  }

  // ③ 查找作品
  const worksDB = router.db.get("works");
  // 支持字符串和数字类型的ID
  const certianWork = worksDB
    .find((work) => work.id == workId || work.id === parseInt(workId))
    .value();

  if (certianWork) {
    const { channels } = certianWork;
    return res.status(200).jsonp({
      errno: 0,
      data: {
        count: (channels && channels.length) || 0,
        list: channels || [],
      },
      message: "获取作品渠道成功",
    });
  } else {
    return res.status(200).jsonp({
      errno: 16001,
      message: "渠道操作失败，作品不存在",
    });
  }
});

// 创建渠道接口
server.post("/channel", (req, res) => {
  // ① 校验登录
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).jsonp({ errno: 14001, message: "未登录" });
  }
  try {
    verifyToken(authHeader.split(" ")[1]);
  } catch {
    return res.status(401).jsonp({ errno: 14002, message: "登录失效" });
  }

  // ② 获取请求数据
  const { name, workId } = req.body;
  if (!name || !workId) {
    return res.status(400).jsonp({
      errno: 16002,
      message: "渠道名称和作品ID不能为空",
    });
  }

  // ③ 查找作品
  const worksDB = router.db.get("works");
  const work = worksDB
    .find((work) => work.id == workId || work.id === parseInt(workId))
    .value();

  if (!work) {
    return res.status(404).jsonp({
      errno: 16003,
      message: "作品不存在",
    });
  }

  // ④ 生成新渠道数据
  const newChannelId = Date.now(); // 使用时间戳作为唯一ID
  const newChannel = {
    id: newChannelId,
    name,
    workId: parseInt(workId),
    status: 1,
  };

  // ⑤ 更新作品的渠道列表
  const currentChannels = work.channels || [];
  const updatedChannels = [...currentChannels, newChannel];

  worksDB
    .find((work) => work.id == workId || work.id === parseInt(workId))
    .assign({ channels: updatedChannels })
    .write();

  // ⑥ 返回创建的渠道数据
  return res.status(200).jsonp({
    errno: 0,
    data: newChannel,
    message: "创建渠道成功",
  });
});

// 删除渠道接口
server.delete("/channel/:id", (req, res) => {
  // ① 校验登录
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).jsonp({ errno: 14001, message: "未登录" });
  }
  try {
    verifyToken(authHeader.split(" ")[1]);
  } catch {
    return res.status(401).jsonp({ errno: 14002, message: "登录失效" });
  }

  // ② 获取渠道ID
  const channelId = req.params.id;
  if (!channelId) {
    return res.status(400).jsonp({
      errno: 16004,
      message: "渠道ID不能为空",
    });
  }

  // ③ 查找包含该渠道的作品
  const worksDB = router.db.get("works");
  const allWorks = worksDB.value();
  let targetWork = null;
  let channelIndex = -1;

  for (const work of allWorks) {
    if (work.channels && work.channels.length > 0) {
      channelIndex = work.channels.findIndex(
        (channel) =>
          channel.id == channelId || channel.id === parseInt(channelId)
      );
      if (channelIndex !== -1) {
        targetWork = work;
        break;
      }
    }
  }

  if (!targetWork || channelIndex === -1) {
    return res.status(404).jsonp({
      errno: 16005,
      message: "渠道不存在",
    });
  }

  // ④ 检查是否是最后一个渠道（不允许删除最后一个渠道）
  if (targetWork.channels.length === 1) {
    return res.status(400).jsonp({
      errno: 16006,
      message: "不能删除最后一个渠道",
    });
  }

  // ⑤ 删除渠道
  const updatedChannels = targetWork.channels.filter(
    (channel) => channel.id != channelId && channel.id !== parseInt(channelId)
  );

  worksDB
    .find((work) => work.id === targetWork.id)
    .assign({ channels: updatedChannels })
    .write();

  // ⑥ 返回删除结果
  return res.status(200).jsonp({
    errno: 0,
    data: { id: channelId },
    message: "删除渠道成功",
  });
});

router.render = (req, res) => {
  const data = res.locals.data;
  if (Array.isArray(data)) {
    // 列表接口：/works  /templates ...
    res.jsonp({
      errno: 0,
      data: {
        list: data,
        count: data.length,
      },
      message: "获取列表成功",
    });
  } else {
    // 详情接口：/works/:id  /templates/:id ...
    res.jsonp({
      errno: 0,
      data,
      message: "success",
    });
  }
};

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
