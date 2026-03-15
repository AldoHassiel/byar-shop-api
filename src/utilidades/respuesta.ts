export interface ApiResponse<T> {
  estado: boolean;
  mensaje: string;
  datos: T | null;
}

export const respuestaOk = <T>(mensaje: string, datos: T): ApiResponse<T> => ({
  estado: true,
  mensaje,
  datos,
});

export const respuestaError = (
  mensaje: string,
  datos: any = null,
): ApiResponse<any> => ({
  estado: false,
  mensaje,
  datos,
});
