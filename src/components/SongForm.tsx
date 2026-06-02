// src/components/SongForm.tsx
import { useState, useEffect } from "react";
import type { Cancion } from "../types/Cancion"; 

interface SongFormProps {
  cancion?: Cancion | null; 
  onGuardar: (datos: { titulo: string; artista: string; duracion: number; portada: string; audio_url?: string }) => void;
  onCancelar: () => void;
}

export const SongForm = ({ cancion, onGuardar, onCancelar }: SongFormProps) => {
  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [duracion, setDuracion] = useState(180);
  const [portada, setPortada] = useState(""); 
  const [audioUrl, setAudioUrl] = useState("");


  useEffect(() => {
    if (cancion) {
      setTitulo(cancion.titulo);
      setArtista(cancion.artista);
      setDuracion(cancion.duracion);
      setPortada(cancion.portada);
      setAudioUrl(cancion.audio_url || "");
    } else {
      setTitulo("");
      setArtista("");
      setDuracion(180);
      setPortada("");
      setAudioUrl("");
    }
  }, [cancion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !artista.trim()) return alert("Rellena los campos obligatorios");
    
    onGuardar({ titulo, artista, duracion, portada, audio_url: audioUrl });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 my-4 flex flex-col gap-3 max-w-md animate-fadeIn">
      <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">
        {cancion ? "✏️ Editar canción" : "🎵 Añadir nueva canción"}
      </h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-sm">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Título de la canción</label>
          <input 
            type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Starboy" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Artista / Banda</label>
          <input 
            type="text" value={artista} onChange={(e) => setArtista(e.target.value)}
            placeholder="Ej: The Weeknd" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-green-500"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Duración (segundos)</label>
            <input 
              type="number" value={duracion} onChange={(e) => setDuracion(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white outline-none focus:border-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Ruta Portada</label>
            <input 
              type="text" value={portada} onChange={(e) => setPortada(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white text-xs outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">URL del audio (MP3)</label>
          <input 
            type="text" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://files.freemusicarchive.org/storage-freemusicarchive-org/..."
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white text-xs outline-none focus:border-green-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors">
            {cancion ? "Actualizar" : "Guardar"}
          </button>
          <button type="button" onClick={onCancelar} className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-400 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};