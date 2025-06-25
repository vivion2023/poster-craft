// @ts-nocheck
const jsonServer = require("json-server");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router(__dirname + "/db.json");
const middlewares = jsonServer.defaults();
const SECRET_KEY = "1234567890"; //密钥
const expiresIn = "1h"; //过期时间
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

const rewriter = jsonServer.rewriter({
  "/api/*": "/$1",
});
server.use(bodyParser.json());
server.use(rewriter);
server.use(middlewares);
// 用户登录
server.post("/users/loginByPhoneNumber", (req, res) => {
  const { phoneNumber, veriCode } = req.body;
  const accessToken = createToken({ phoneNumber, veriCode });
  res.status(200).jsonp({
    errno: 0,
    data: {
      token: accessToken,
    },
  });
});

// 获取验证码（不需要认证）
server.post("/users/genVeriCode", (req, res) => {
  const veriCode = Math.floor(Math.random() * 9000 + 1000);
  return res.status(200).jsonp({
    errno: 0,
    data: { veriCode },
    message: "验证码获取成功",
  });
});

server.use((req, res, next) => {
  const errorResp = {
    errno: 12001,
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

router.render = (req, res) => {
  res.jsonp({
    list: res.locals.data,
    count: res.locals.data.length,
  });
};

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
