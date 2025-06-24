// @ts-nocheck
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(__dirname + "/db.json");
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter({
  "/api/*": "/$1",
});
server.use(rewriter);
server.use(middlewares);
server.get("/echo", (req, res) => {
  res.jsonp({ test: "123" });
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
