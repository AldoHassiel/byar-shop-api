import express from "express";
import cookieParser from "cookie-parser";

import rutaTest from "@/modulos/test/test.ruta.js";
import rutaAutenticacion from "@/modulos/autenticacion/autenticacion.ruta.js";
import rutaAdmin from "@/modulos/admin/admin.ruta.js";
import rutaCategoria from "@/modulos/categoria/categoria.ruta.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(rutaTest);
app.use(rutaAutenticacion);
app.use(rutaAdmin);
app.use(rutaCategoria);

export default app;
