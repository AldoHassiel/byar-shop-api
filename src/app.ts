import express from "express";
import rutaTest from "@/modulos/test/test.ruta.js";
import rutaAutenticacion from "@/modulos/autenticacion/autenticacion.ruta.js";

const app = express();

app.use(express.json());

app.use(rutaTest);
app.use(rutaAutenticacion);

export default app;
