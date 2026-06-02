import { Heart, Disc } from "lucide-react";
import type { Cancion } from "../types/Cancion";

interface AlbumCardProps {
  cancion: Cancion;
  alLeDarPlay: () => void;
  esFavorita: boolean;
  onToggleFavorito: () => void;
}

export const AlbumCard = ({ cancion, alLeDarPlay, esFavorita, onToggleFavorito }: AlbumCardProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:bg-gray-700 transition-all cursor-pointer relative min-w-[180px] max-w-[180px] flex flex-col justify-between">
      
      <div className="relative h-40 w-full mb-3 overflow-hidden rounded-lg bg-gray-900">
        {cancion.portada ? (
          <img 
            onClick={alLeDarPlay}
            src={cancion.portada} 
            alt={cancion.titulo} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div onClick={alLeDarPlay} className="w-full h-full flex items-center justify-center text-gray-500 hover:scale-105 transition-transform duration-300">
            <Disc className="h-12 w-12" />
          </div>
        )}
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); 
            onToggleFavorito();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-60 hover:scale-110 transition-all z-10 border border-gray-700"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              esFavorita ? "fill-red-500 text-red-500" : "text-white hover:text-red-400"
            }`} 
          />
        </button>
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 onClick={alLeDarPlay} className="font-bold text-sm text-white truncate w-full">
          {cancion.titulo}
        </h3>
        <p onClick={alLeDarPlay} className="text-xs text-gray-400 truncate w-full">
          {cancion.artista}
        </p>
      </div>

    </div>
  );
};