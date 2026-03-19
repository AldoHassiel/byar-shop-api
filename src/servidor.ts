import app from "@/app.js";
import { PUERTO } from "@/config/global.js";
import swaggerUI from "swagger-ui-express";
import swaggerOutput from "swagger-output.json" with { type: "json" };

app.use("/documentacion", swaggerUI.serve, swaggerUI.setup(swaggerOutput));

app.listen(PUERTO, () => {
  console.log(`El servidor se esta ejecutando en el puerto ${PUERTO}`);
});
