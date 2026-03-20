import app from "@/app.js";
import { PUERTO } from "@/config/global.js";

app.listen(PUERTO, () => {
  console.log(`El servidor se esta ejecutando en el puerto ${PUERTO}`);
});
