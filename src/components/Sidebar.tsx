// src/components/Sidebar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; 
import { supabase } from "../lib/supabaseClient";
import { Home, Search, Library, Heart, Plus, LogIn, User } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import type { User as SupabaseUser } from "@supabase/supabase-js";
interface SidebarProps {
  onCrearPlaylist: () => void;
  filtrarFavoritas: boolean;
  setFiltrarFavoritas: (valor: boolean) => void;
}

export const Sidebar = ({ onCrearPlaylist, filtrarFavoritas, setFiltrarFavoritas }: SidebarProps) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<SupabaseUser | null>(null);
  const { playlists } = useMusic();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUsuario(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <aside className="w-64 bg-black h-full flex flex-col justify-between p-4 border-r border-gray-800 select-none">
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <span className="text-green-500 font-serif">≈</span> WAVE
          </span>
        </div>

        <nav className="flex flex-col gap-3 text-sm font-semibold text-gray-400">
          <Link to="/" className="flex items-center gap-3 hover:text-white transition-colors px-2 py-1">
            <Home className="h-4 w-4" /> Inicio
          </Link>
          <Link to="/buscar" className="flex items-center gap-3 hover:text-white transition-colors px-2 py-1">
            <Search className="h-4 w-4" /> Buscar
          </Link>
          <Link to="/biblioteca" className="flex items-center gap-3 hover:text-white transition-colors px-2 py-1">
            <Library className="h-4 w-4" /> Tu biblioteca
          </Link>
        </nav>

        <div className="flex flex-col gap-2 mt-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-2">Playlists</span>
          
          <button 
            onClick={() => {
              setFiltrarFavoritas(!filtrarFavoritas);
              navigate("/");
            }} 
            className={`flex justify-between items-center text-sm font-semibold w-full px-2 py-1.5 rounded transition-colors text-left ${
              filtrarFavoritas ? "text-white bg-red-500/10" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className={`h-4 w-4 ${filtrarFavoritas ? "fill-green-500" : "fill-gray-400"}`} /> 
              <span>{filtrarFavoritas ? "Viendo Favoritos" : "Favoritos"}</span>
            </div>
            <div className={`w-5 h-3 rounded-full transition-colors ${filtrarFavoritas ? "bg-green-500" : "bg-gray-400"}`}>
              <div className={`w-2.5 h-2.5 bg-white rounded-full shadow-md transform transition-transform ${filtrarFavoritas ? "translate-x-2" : "translate-x-0"}`}></div>
            </div>
          </button>

          <button 
            onClick={onCrearPlaylist} 
            className="flex items-center gap-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors px-2 py-1.5 w-full text-left rounded hover:bg-white/5"
          >
            <Plus className="h-4 w-4 text-gray-400" />
            <span>Nueva playlist</span>
          </button>

          <div className="flex flex-col gap-1  overflow-y-auto mt-2 px-2 border-l border-gray-800">
            {playlists.length === 0 ? (
              <span className="text-xs text-gray-600 italic py-1">Sin playlists creadas</span>
            ) : (
              playlists.map((pl) => (
                <Link 
                  key={pl.id} 
                  to={`/playlist/${pl.id}`} 
                  className="text-xs text-gray-400 hover:text-white py-1 truncate block transition-colors"
                >
                  📻 {pl.nombre}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
        {usuario ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-400 px-2 truncate">
              <User className="h-4 w-4 text-green-500 shrink-0" />
              <span className="truncate">{usuario.email}</span>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="text-left text-xs text-red-400 hover:text-red-300 transition-colors font-medium px-2 py-1 rounded hover:bg-white/5"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-bold text-green-500 hover:text-green-400 transition-colors px-2 py-1.5 rounded bg-green-500/10 hover:bg-green-500/20"
          >
            <LogIn className="h-4 w-4" />
            Iniciar Sesión
          </Link>
        )}

        <span className="text-[10px] text-gray-600 px-2">WAVE 2026</span>
      </div>

    </aside>
  );
};
