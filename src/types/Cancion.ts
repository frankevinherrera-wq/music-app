// src/types.ts
export interface Cancion {
  id: number;
  titulo: string;
  artista: string;
  duracion: number;
  portada: string;
  audio_url?: string; 
}

