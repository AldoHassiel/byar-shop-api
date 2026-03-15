export interface UsuarioBaseDTO {
  id: number;
  nombre: string;
  apellidos?: string | null;
  telefono?: string | null;
  correo: string;
  es_admin: boolean;
}
