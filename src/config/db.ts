import pg from "pg";
import { DB_PUERTO } from "@/config/global.js";

export const db = new pg.Pool({
  user: process.env.DB_USUARIO,
  connectionString: process.env.DB_URL,
  password: process.env.DB_PWD,
  database: process.env.DB_NOMBRE,
  port: DB_PUERTO,

  ssl:
    process.env.NODE_ENV === "produccion"
      ? { rejectUnauthorized: false }
      : true,
});
