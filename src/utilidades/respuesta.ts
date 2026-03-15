export const respuesta = (estado: boolean, mensaje: string, datos: []) => {
  return {
    estado,
    mensaje,
    datos,
  };
};
