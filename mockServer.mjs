import { createApp } from "json-server/lib/app.js";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// 创建数据库适配器
const adapter = new JSONFile("db.json");
const db = new Low(adapter, {});

// 读取数据
await db.read();

// 创建应用
const app = createApp(db);

// 启动服务器
app.listen(3000, () => {
  console.log("JSON Server is running on http://localhost:3000");
});
