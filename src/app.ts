import express from "express";
import rutaTest from "@/modulos/test/test.ruta.js";
import rutaAutenticacion from "@/modulos/autenticacion/autenticacion.ruta.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(rutaTest);
app.use(rutaAutenticacion);

export default app;
