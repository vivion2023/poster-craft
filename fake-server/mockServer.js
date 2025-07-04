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
  for (const [phoneNumber, data] of veriCodeStore.entries()) {
    if (now - data.timestamp > VERI_CODE_EXPIRE_TIME) {
      veriCodeStore.delete(phoneNumber);
    }
  }
}

const rewriter = jsonServer.rewriter({
  "/api/*": "/$1",
});
server.use(bodyParser.json());
server.use(rewriter);
server.use(middlewares);
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
    return res.status(200).jsonp({
      errno: 12002,
      message: "验证码不存在或已过期，请重新获取",
    });
  }

  // 验证验证码是否正确
  if (storedVeriCodeData.code !== veriCode.toString()) {
    return res.status(200).jsonp({
      errno: 12003,
      message: "验证码错误",
    });
  }

  // 验证码使用后删除（一次性使用）
  veriCodeStore.delete(phoneNumber);

  const accessToken = createToken({ phoneNumber });
  res.status(200).jsonp({
    errno: 0,
    data: {
      token: accessToken,
    },
    message: "登录成功",
  });
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
  // 添加3秒延迟来查看loading效果
  setTimeout(() => {
    // const templates = [
    //   {
    //     id: 1,
    //     title: "前端架构师海报",
    //     desc: "前端架构师海报",
    //     coverImg:
    //       "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    //     uuid: "123",
    //     author: "vivion",
    //     copiedCount: 123,
    //     isTemplate: true,
    //     isHot: true,
    //     isNew: true,
    //     status: 13,
    //     user: {
    //       gender: "male",
    //       nickName: "vivion",
    //       picture:
    //         "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    //       userName: "13455556666",
    //     },
    //   },
    //   {
    //     id: 2,
    //     title: "前端架构师海报2",
    //     desc: "前端架构师海报",
    //     coverImg: "http://static-dev.imooc-lego.com/imooc-test/sZHlgv.png",
    //     uuid: "124",
    //     author: "vivion",
    //     copiedCount: 23,
    //     isTemplate: true,
    //     isHot: true,
    //     isNew: true,
    //     status: 1,
    //     user: {
    //       gender: "male",
    //       nickName: "vivion",
    //       picture:
    //         "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    //       userName: "13566667777",
    //     },
    //   },
    // ];

    res.status(200).jsonp({
      errno: 0,
      data: {
        list: templateData.list,
        count: templateData.list.length,
      },
      message: "获取模板列表成功",
    });
  }, 3000); // 3秒延迟
});

server.use((req, res, next) => {
  const errorResp = {
    errno: 12005,
    message: "登录校验失败",
  };

  const authHeader = req.headers.authorization;
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
