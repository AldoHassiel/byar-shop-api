import app from "./app.js";

const PUERTO = process.env.PUERTO || 8500;

app.listen(PUERTO, () => {
  console.log(`El servidor se esta ejecutando en el puerto ${PUERTO}`);
});
