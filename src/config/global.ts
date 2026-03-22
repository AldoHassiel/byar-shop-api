import type { Token } from "@/utilidades/token.js";

export const PUERTO = process.env.PUERTO || 8500;
export const DB_PUERTO = Number(process.env.DB_PUERTO) || 5432;
export const SECRETO_JWT = process.env.SECRETO_JWT || "CreaElArchivoPuntoEnv";
export const SAL = Number(process.env.SAL_JWT) || 10;
export const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";

declare global {
  namespace Express {
    interface Request {
      usuario?: Token;
    }
  }
}
