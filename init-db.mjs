import fs from "fs";
import mysql from "mysql2/promise";

const sql = fs.readFileSync("sql/init.sql", "utf8");

const db = await mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  multipleStatements: true,
});

await db.query(sql);
console.log("✅ Tabele napravljene!");
await db.end();