import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { FRONT_URL } from "./config/global.js";

extendZodWithOpenApi(z);

import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import rutaTest from "@/modulos/test/test.ruta.js";
import rutaAutenticacion from "@/modulos/autenticacion/autenticacion.ruta.js";
import rutaAdmin from "@/modulos/admin/admin.ruta.js";
import rutaCategoria from "@/modulos/categoria/categoria.ruta.js";
import rutaSubcategoria from "@/modulos/subcategoria/subcategoria.ruta.js";
import rutaMarcas from "@/modulos/marcas/marcas.ruta.js";
import rutasProductos from "./modulos/productos/productos.ruta.js";
import rutasCP from "./modulos/cp/cp.ruta.js";
import rutasEstadosPedidos from "./modulos/estadosPedidos/estados.ruta.js";
import rutasDirecciones from "./modulos/usuario/direcciones/direcciones.ruta.js";
import rutasMetodosPago from "./modulos/usuario/metodosDePago/metodosPago.ruta.js";

import "@/modulos/productos/productos.docs.js";
import "@/modulos/autenticacion/autenticacion.docs.js";
import "@/modulos/admin/admin.docs.js";
import "@/modulos/categoria/categoria.docs.js";
import "@/modulos/marcas/marcas.docs.js";
import "@/modulos/subcategoria/subcategoria.docs.js";
import "@/modulos/usuario/direcciones/direcciones.docs.js";
import "@/modulos/usuario/metodosDePago/metodosPago.docs.js";
import "@/modulos/cp/cp.docs.js";
import "@/modulos/estadosPedidos/estados.docs.js";

import { registro } from "./config/openAPI/openAPI.registro.js";
import { generarDocumentacion } from "./config/openAPI/openAPI.config.js";

registro.registerComponent("securitySchemes", "autenticacionBearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Token JWT obtenido al iniciar sesión",
});

const app = express();

app.use(
  cors({
    origin: [FRONT_URL],
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(rutaTest);
app.use(rutaAutenticacion);
app.use(rutaAdmin);
app.use(rutaCategoria);
app.use(rutaSubcategoria);
app.use(rutaMarcas);
app.use(rutasProductos);
app.use(rutasCP);
app.use(rutasEstadosPedidos);
app.use(rutasDirecciones);
app.use(rutasMetodosPago);

const especificacion = generarDocumentacion();
app.use("/docs", swaggerUi.serve, swaggerUi.setup(especificacion));

export default app;
