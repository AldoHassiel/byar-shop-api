import express from "express";
import rutaTest from "./modulos/test/test.ruta.js";

const app = express();

app.use(express.json());

app.use(rutaTest);

export default app;
