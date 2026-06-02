import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Player } from "../components/Player";
import { useMusic } from "../context/MusicContext";
import { PlaylistForm } from "../components/PlaylistForm";
import { Disc } from "lucide-react";

export const SearchPage = () => {
  const { 
    canciones = [], 
    alLeDarPlay, 
    cancionActual, 
    reproduciendo, 
    setReproduciendo, 
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
  
  const [busqueda, setBusqueda] = useState<string>("");

  const cancionesFiltradas = canciones.filter((cancion) => {
    const termino = busqueda.toLowerCase().trim();
    return (
      cancion.titulo.toLowerCase().includes(termino) ||
      cancion.artista.toLowerCase().includes(termino)
    );
  });

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

  return (
    <div className="flex h-screen bg-black text-white antialiased flex-col relative">
      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar 
          onCrearPlaylist={() => {
            setPlaylistEditando(null); 
            setPanelPlaylistAbierto(true); 
          }} 
          filtrarFavoritas={false}
          setFiltrarFavoritas={() => {}}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-black mb-6 text-white tracking-tight">Buscar</h1>

          <div className="mb-8">
            <input
              type="text"
              placeholder="¿Qué quieres escuchar?"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full max-w-md py-2.5 px-4 bg-surface-2 border border-white/10 rounded-full text-white text-sm outline-none placeholder:text-muted focus:border-primary transition-all"
            />
          </div>

          {cancionesFiltradas.length === 0 && busqueda.trim() !== "" && (
            <p className="text-xs text-gray-500 italic">No se encontraron canciones para "{busqueda}".</p>
          )}

          {busqueda.trim() === "" && canciones.length === 0 && (
            <p className="text-xs text-gray-500 italic">No hay canciones en tu biblioteca todavía.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cancionesFiltradas.map((cancion) => (
              <div 
                key={cancion.id} 
                onClick={() => alLeDarPlay(cancion)}
                className="bg-surface-1 p-4 rounded-xl border border-white/5 hover:bg-surface-2 transition-all cursor-pointer group flex flex-col gap-3"
              >
                {cancion.portada ? (
                  <img 
                    src={cancion.portada} 
                    alt={cancion.titulo} 
                    className="w-full aspect-square rounded-lg object-cover shadow-sm shrink-0" 
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 text-gray-500">
                    <Disc className="h-10 w-10" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate text-white">{cancion.titulo}</h3>
                  <p className="text-xs text-muted truncate mt-0.5">{cancion.artista}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Player 
        cancion={cancionActual} 
        reproduciendo={reproduciendo} 
        setReproduciendo={setReproduciendo} 
        alAdelantar={siguienteCancion}
        alRetroceder={anteriorCancion}
        alAleatorio={cancionAleatoria}
      />

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