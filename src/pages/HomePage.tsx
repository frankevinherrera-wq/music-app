// src/pages/HomePage.tsx
import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router"; 
import { supabase } from "../lib/supabaseClient";  
import { HeroBanner } from "../components/HeroBanner";
import { SectionHeader } from "../components/SectionHeader";
import { AlbumCard } from "../components/AlbumCard";
import { Sidebar } from "../components/Sidebar";  
import { Player } from "../components/Player";    
import { RightSidebar } from "../components/RightSidebar"; 
import { SongForm } from "../components/SongForm"; 
import { PlaylistForm } from "../components/PlaylistForm"; 
import { User, LogOut } from "lucide-react"; 
import { useMusic } from "../context/MusicContext";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const HomePage = () => {
  const navigate = useNavigate();
  const {
    canciones, cargando, error, reproduciendo, setReproduciendo,
    cancionActual, favoritas, alLeDarPlay, toggleFavorito,
    crearNuevaPlaylist, crearCancion, siguienteCancion, anteriorCancion, cancionAleatoria,
    panelPlaylistAbierto, setPanelPlaylistAbierto, playlistEditando, setPlaylistEditando, editarPlaylist
  } = useMusic();

  const [formAbierto, setFormAbierto] = useState(false);
  const [mostrarSoloFavoritas, setMostrarSoloFavoritas] = useState(false);
  const [usuario, setUsuario] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUsuario(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGuardarCancion = async (datos: { titulo: string; artista: string; duracion: number; portada: string; audio_url?: string }) => {
    const exito = await crearCancion(datos);
    if (exito) setFormAbierto(false); 
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

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate("/login"); 
  };

  if (cargando) return <div className="min-h-screen bg-black text-gray-400 p-8 flex items-center justify-center font-semibold text-xs">Cargando musica WAVE...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-500 p-8 flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden relative">
      <Sidebar 
  onCrearPlaylist={() => {
    setPlaylistEditando(null);
    setPanelPlaylistAbierto(true);
  }} 
  filtrarFavoritas={mostrarSoloFavoritas}
  setFiltrarFavoritas={setMostrarSoloFavoritas} 
/>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          
          <main className="flex-1 overflow-y-auto bg-gray-900">
            
            <header className="w-full border-b border-gray-800 px-6 py-4 mb-6 bg-gray-900 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">
                WAVE • {mostrarSoloFavoritas ? "Mis Favoritas" : "Inicio"}
              </span>
              
              <div className="flex items-center gap-4">
                {usuario ? (
                  <div className="flex items-center gap-3 bg-gray-950 px-3 py-1.5 rounded-full border border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs text-gray-300 max-w-[150px] truncate">
                      <User className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      <span className="truncate">{usuario.email}</span>
                    </div>
                    <button 
                      onClick={handleCerrarSesion}
                      title="Cerrar sesion"
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link 
                      to="/register" 
                      className="text-xs font-bold text-gray-400 hover:text-white px-3 py-2 transition-colors"
                    >
                      Registrarse
                    </Link>
                    <Link 
                      to="/login" 
                      className="bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-4 py-2 rounded-full transition-all hover:scale-105"
                    >
                      Iniciar Sesion
                    </Link>
                  </div>
                )}
              </div>
            </header>

            <div className="flex flex-col gap-8 px-6 pb-8">
              <HeroBanner reproduciendo={reproduciendo} setReproduciendo={setReproduciendo} />

              <section>
                <div className="flex justify-between items-center mb-2">
                  <SectionHeader 
                    titulo={mostrarSoloFavoritas ? "Tus canciones favoritas" : "Escuchado recientemente"} 
                  />
                  
                  <button 
                    onClick={() => setFormAbierto(true)}
                    className="bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Nueva cancion
                  </button>
                </div>

                {formAbierto && (
                  <SongForm 
                    onGuardar={handleGuardarCancion} 
                    onCancelar={() => setFormAbierto(false)} 
                  />
                )}
                
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
                  {canciones
                    .filter((cancion) => !mostrarSoloFavoritas || favoritas.some((f) => f.id === cancion.id))
                    .slice(0, 6)
                    .map((cancion) => {
                      const esFavorita = favoritas.some((f) => f.id === cancion.id);
                      return (
                        <AlbumCard 
                          key={cancion.id} 
                          cancion={cancion} 
                          alLeDarPlay={() => alLeDarPlay(cancion)} 
                          esFavorita={esFavorita} 
                          onToggleFavorito={() => toggleFavorito(cancion)}
                        />
                      );
                    })}
                  
                  {canciones.length === 0 && !mostrarSoloFavoritas && (
                    <p className="text-xs text-gray-500 italic py-4">
                      No hay canciones. Agrega una con el boton "+ Nueva cancion".
                    </p>
                  )}

                  {mostrarSoloFavoritas && favoritas.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-4">
                      No has marcado ninguna cancion con un corazon todavia.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </main>

          <RightSidebar />
        </div>

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