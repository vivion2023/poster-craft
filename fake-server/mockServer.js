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

const rewriter = jsonServer.rewriter({
  "/api/*": "/$1",
});
server.use(bodyParser.json());
server.use(rewriter);
server.use(middlewares);
server.post("/users/loginByPhoneNumber", (req, res) => {
  const { phoneNumber, veriCode } = req.body;
  const accessToken = createToken({ phoneNumber, veriCode });
  res.status(200).jsonp({
    token: accessToken,
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
