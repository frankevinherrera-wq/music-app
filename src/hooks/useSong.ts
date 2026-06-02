// src/hooks/useSong.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Cancion } from "../types/Cancion";

export interface Playlist {
  id: number;
  nombre: string;
  descripcion: string;
  portada?: string;
}

export type PlaylistInput = Omit<Playlist, "id">;
export type CancionInput = Omit<Cancion, "id">;

export const useSong = () => {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [reproduciendo, setReproduciendo] = useState<boolean>(false);
  const [cancionActual, setCancionActual] = useState<Cancion | null>(null);
  const [panelPlaylistAbierto, setPanelPlaylistAbierto] = useState<boolean>(false);
  const [playlistEditando, setPlaylistEditando] = useState<Playlist | null>(null);
  const [favoritas, setFavoritas] = useState<Cancion[]>([]);


  useEffect(() => {
    setCargando(true);
    setError(null);
    
    const cargarDatos = async () => {
      // Cargar canciones
      const { data: cancionesData, error: cancionesError } = await supabase
        .from("canciones")
        .select("*");

      if (cancionesError) {
        setError("Error al cargar las canciones: " + cancionesError.message);
      } else {
        setCanciones(cancionesData ?? []);
      }

      // Cargar playlists
      const { data: playlistsData, error: playlistsError } = await supabase
        .from("playlists")
        .select("*");

      if (playlistsError) {
        setError("Error al cargar las playlists: " + playlistsError.message);
      } else {
        setPlaylists(playlistsData ?? []);
      }

      setCargando(false);
    };

    cargarDatos();
  }, []);

  
  const crearPlaylist = async (nueva: PlaylistInput): Promise<boolean> => {
    setError(null);

    const { data, error: supabaseError } = await supabase
      .from("playlists")
      .insert(nueva)
      .select()
      .single();

    if (supabaseError) {
      setError("Error al insertar: " + supabaseError.message);
      return false;
    }

    setPlaylists((prev) => [data as Playlist, ...prev]);
    return true;
  };

  const actualizarPlaylist = async (id: number, cambios: PlaylistInput): Promise<boolean> => {
    setError(null);

    const { error: supabaseError } = await supabase
      .from("playlists")
      .update(cambios)
      .eq("id", id);

    if (supabaseError) {
      setError("Error al actualizar: " + supabaseError.message);
      return false;
    }

    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { id, ...cambios } : p))
    );
    return true;
  };

  const eliminarPlaylist = async (id: number): Promise<boolean> => {
    setError(null);

    const { error: supabaseError } = await supabase
      .from("playlists")
      .delete()
      .eq("id", id);

    if (supabaseError) {
      setError("Error al eliminar: " + supabaseError.message);
      return false;
    }

    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    return true;
  };


  const crearCancion = async (nueva: CancionInput): Promise<boolean> => {
    setError(null);

    const { data, error: supabaseError } = await supabase
      .from("canciones")
      .insert(nueva)
      .select()
      .single();

    if (supabaseError) {
      setError("Error al insertar: " + supabaseError.message);
      return false;
    }

    setCanciones((prev) => [data as Cancion, ...prev]);
    return true;
  };

  const actualizarCancion = async (id: number, cambios: CancionInput): Promise<boolean> => {
    setError(null);

    const { error: supabaseError } = await supabase
      .from("canciones")
      .update(cambios)
      .eq("id", id);

    if (supabaseError) {
      setError("Error al actualizar: " + supabaseError.message);
      return false;
    }

    setCanciones((prev) =>
      prev.map((c) => (c.id === id ? { id, ...cambios } as Cancion : c))
    );
    
    if (cancionActual?.id === id) {
      setCancionActual({ id, ...cambios } as Cancion);
    }
    return true;
  };

  const eliminarCancion = async (id: number): Promise<boolean> => {
    setError(null);

    const { error: supabaseError } = await supabase
      .from("canciones")
      .delete()
      .eq("id", id);

    if (supabaseError) {
      setError("Error al eliminar: " + supabaseError.message);
      return false;
    }

    setCanciones((prev) => prev.filter((c) => c.id !== id));
    setFavoritas((prev) => prev.filter((c) => c.id !== id));
    if (cancionActual?.id === id) setCancionActual(null);
    return true;
  };


  const alLeDarPlay = (c: Cancion) => {
    setCancionActual(c);
    setReproduciendo(true);
  };

  const toggleFavorito = (cancion: Cancion) => {
    setFavoritas((prev) =>
      prev.some((f) => f.id === cancion.id)
        ? prev.filter((f) => f.id !== cancion.id)
        : [...prev, cancion]
    );
  };

  const siguienteCancion = () => {
    if (canciones.length === 0 || !cancionActual) return;
    const index = canciones.findIndex((c) => c.id === cancionActual.id);
    if (index === -1) return;
    const nextIndex = (index + 1) % canciones.length;
    setCancionActual(canciones[nextIndex]);
    setReproduciendo(true);
  };

  const anteriorCancion = () => {
    if (canciones.length === 0 || !cancionActual) return;
    const index = canciones.findIndex((c) => c.id === cancionActual.id);
    if (index === -1) return;
    const prevIndex = (index - 1 + canciones.length) % canciones.length;
    setCancionActual(canciones[prevIndex]);
    setReproduciendo(true);
  };

  const cancionAleatoria = () => {
    if (canciones.length === 0) return;
    const opciones = canciones.filter((c) => c.id !== cancionActual?.id);
    const lista = opciones.length > 0 ? opciones : canciones;
    const random = lista[Math.floor(Math.random() * lista.length)];
    setCancionActual(random);
    setReproduciendo(true);
  };

  return {
    canciones,
    playlists,
    cargando,
    error,
    reproduciendo,
    setReproduciendo,
    cancionActual,
    setCancionActual,
    favoritas,
    panelPlaylistAbierto,
    setPanelPlaylistAbierto,
    playlistEditando,
    setPlaylistEditando,
    alLeDarPlay,
    toggleFavorito,
    eliminarCancion,
    eliminarPlaylist,
    siguienteCancion,
    anteriorCancion,
    cancionAleatoria,
    crearNuevaPlaylist: crearPlaylist,
    crearCancion,
    editarPlaylist: actualizarPlaylist,
    editarCancion: actualizarCancion,
  };
};

export default useSong;