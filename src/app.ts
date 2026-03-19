import express from "express";
import cookieParser from "cookie-parser";

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

const app = express();

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

export default app;
