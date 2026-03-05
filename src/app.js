import express from "express";
import { db } from "./config/db.js";
import productosRouter from "./rutas/productos.ruta.js";

const app = express();

app.use(productosRouter);

app.get("/", (_, res) => {
  res.send("<h1>Hola mundo</h1>");
});

app.get("/ping", async (_, res) => {
  const resultado = await db.query("SELECT NOW()");
  return res.json(resultado.rows[0]);
});

export default app;