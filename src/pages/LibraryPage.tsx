import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Player } from "../components/Player";
import { Music, Pencil, Trash2, Plus, Disc } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import { SongForm } from "../components/SongForm";
import type { Cancion } from "../types/Cancion";
import { PlaylistForm } from "../components/PlaylistForm";

export const LibraryPage = () => {
  const { 
    canciones = [],
    playlists = [], 
    alLeDarPlay, 
    reproduciendo, 
    setReproduciendo, 
    cancionActual, 
    eliminarPlaylist,
    eliminarCancion,
    crearCancion,
    editarCancion,
    siguienteCancion,
    anteriorCancion,
    cancionAleatoria,
    panelPlaylistAbierto,
    setPanelPlaylistAbierto,
    playlistEditando,
    setPlaylistEditando,
    crearNuevaPlaylist,
    editarPlaylist
  } = useMusic();

  const [panelAbierto, setPanelAbierto] = useState<boolean>(false);
  const [cancionEditando, setCancionEditando] = useState<Cancion | null>(null);

  const handleNuevaPlaylistClick = () => {
    setPlaylistEditando(null);
    setPanelPlaylistAbierto(true);
  };

  const handleEditarPlaylistClick = (playlist: any) => {
    setPlaylistEditando(playlist);
    setPanelPlaylistAbierto(true);
  };

  const handleGuardarPlaylistGlobal = async (datos: { nombre: string; descripcion: string; portada: string }) => {
    let exito: boolean;
    if (playlistEditando) {
      exito = await editarPlaylist(playlistEditando.id, datos);
    } else {
      exito = await crearNuevaPlaylist(datos); 
    }

    if (exito) {
      setPanelPlaylistAbierto(false);
      setPlaylistEditando(null);
    }
  };

  const handleNuevaCancion = () => {
    setCancionEditando(null);
    setPanelAbierto(true);
  };

  const handleCancelar = () => {
    setPanelAbierto(false);
    setCancionEditando(null);
  };

  const handleEditarCancionClick = (cancion: Cancion) => {
    setCancionEditando(cancion);
    setPanelAbierto(true);
  };

  const handleGuardar = async (datos: { titulo: string; artista: string; duracion: number; portada: string; audio_url?: string }) => {
    let exito: boolean;

    if (cancionEditando) {
      exito = await editarCancion(cancionEditando.id, datos);
    } else {
      exito = await crearCancion(datos);
    }

    if (exito) {
      setPanelAbierto(false);
      setCancionEditando(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden relative">
      <Sidebar 
        onCrearPlaylist={handleNuevaPlaylistClick} 
        filtrarFavoritas={false}
        setFiltrarFavoritas={() => {}}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-white">Tu biblioteca</h1>
              <p className="text-xs text-gray-400 mt-1">Administra tus canciones y colecciones personales.</p>
            </div>
            <button
              onClick={handleNuevaCancion}
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Nueva cancion
            </button>
          </header>

          {panelAbierto && (
            <div className="mb-6">
              <SongForm 
                cancion={cancionEditando}
                onGuardar={handleGuardar}
                onCancelar={handleCancelar}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SECCIÓN PLAYLISTS */}
            <section className="bg-gray-950 p-6 rounded-2xl border border-gray-800 flex flex-col gap-4">
              <div className="flex items-center justify-between text-green-500 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <h2>Mis Playlists ({playlists.length})</h2>
                </div>
                <button 
                  onClick={handleNuevaPlaylistClick}
                  className="flex items-center gap-1 text-[11px] bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-1 rounded-lg transition-all"
                >
                  <Plus className="h-3 w-3" /> Nueva
                </button>
              </div>
              
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {playlists.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No has creado ninguna playlist todavia.</p>
                ) : (
                  playlists.map((pl) => (
                    <div 
                      key={pl.id} 
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 transition-all group"
                    >
                      {pl.portada ? (
                        <img 
                          src={pl.portada} 
                          alt={pl.nombre} 
                          className="h-14 w-14 rounded-lg object-cover shadow-md bg-gray-800 shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 text-gray-500">
                          <Music className="h-6 w-6" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-green-400 transition-colors">
                          {pl.nombre}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {pl.descripcion || "Sin descripcion disponible."}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditarPlaylistClick(pl)}
                          title="Editar Playlist"
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-amber-400 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => eliminarPlaylist(pl.id)}
                          title="Eliminar Playlist"
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* SECCIÓN CANCIONES */}
            <section className="bg-gray-950 p-6 rounded-2xl border border-gray-800 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <Disc className="h-4 w-4" />
                <h2>Todas las canciones ({canciones.length})</h2>
              </div>

              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                {canciones.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No hay canciones registradas en la plataforma.</p>
                ) : (
                  canciones.map((cancion) => (
                    <div 
                      key={cancion.id} 
                      className="flex items-center justify-between p-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-all group"
                    >
                      <div 
                        onClick={() => alLeDarPlay(cancion)}
                        className="flex items-center gap-3 truncate cursor-pointer flex-1"
                      >
                        {cancion.portada ? (
                          <img 
                            src={cancion.portada} 
                            alt={cancion.titulo} 
                            className="h-10 w-10 rounded-lg object-cover shadow-sm shrink-0" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 text-gray-500">
                            <Disc className="h-5 w-5" />
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-green-400 transition-colors">{cancion.titulo}</h4>
                          <p className="text-[10px] text-gray-400 truncate">{cancion.artista}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => handleEditarCancionClick(cancion)}
                          title="Editar Cancion"
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-amber-400 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => eliminarCancion(cancion.id)}
                          title="Eliminar Cancion"
                          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </div>
        </main>

        <Player 
          cancion={cancionActual} 
          reproduciendo={reproduciendo} 
          setReproduciendo={setReproduciendo} 
          alAdelantar={siguienteCancion}
          alRetroceder={anteriorCancion}
          alAleatorio={cancionAleatoria}
        />
      </div>

      {panelPlaylistAbierto && (
        <PlaylistForm 
          playlist={playlistEditando}
          onGuardar={handleGuardarPlaylistGlobal}
          onCancelar={() => {
            setPanelPlaylistAbierto(false);
            setPlaylistEditando(null);
          }}
        />
      )}
    </div>
  );
};