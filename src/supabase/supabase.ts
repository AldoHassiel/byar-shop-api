import { supabase } from "@/config/supabase.js";

export const subirImagen = async (
  archivo: Express.Multer.File,
  carpeta: string = "productos",
): Promise<string> => {
  const extension = archivo.mimetype.split("/")[1];
  const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await supabase.storage
    .from("imagenes")
    .upload(nombreArchivo, archivo.buffer, {
      contentType: archivo.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Error al subir imagen: ${error.message}`);

  const { data } = supabase.storage
    .from("imagenes")
    .getPublicUrl(nombreArchivo);

  return data.publicUrl;
};

export const eliminarImagen = async (imagenUrl: string): Promise<void> => {
  const path = imagenUrl.split("/imagenes/")[1];

  if (!path) {
    throw new Error(`No se pudo extraer el path de la URL: ${imagenUrl}`);
  }

  const { error } = await supabase.storage.from("imagenes").remove([path]);

  if (error) {
    throw new Error(`Error al eliminar imagen de Supabase: ${error.message}`);
  }
};
