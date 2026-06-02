import { useState, useEffect } from "react";

interface PlaylistFormProps {
  playlist: any;
  onGuardar: (datos: { nombre: string; descripcion: string; portada: string }) => void;
  onCancelar: () => void;
}

export const PlaylistForm = ({ playlist, onGuardar, onCancelar }: PlaylistFormProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [portada, setPortada] = useState("");

  useEffect(() => {
    if (playlist) {
      setNombre(playlist.nombre || "");
      setDescripcion(playlist.descripcion || "");
      setPortada(playlist.portada || "");
    } else {
      setNombre("");
      setDescripcion("");
      setPortada("");
    }
  }, [playlist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onGuardar({ nombre: nombre.trim(), descripcion, portada });
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* 
      */}
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        
        <h3 className="text-lg font-bold text-white mb-4">
          {playlist ? "Editar Playlist" : "Crear Nueva Playlist"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Rock para entrenar"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Añade una descripción opcional"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">URL de la Portada</label>
            <input
              type="text"
              value={portada}
              onChange={(e) => setPortada(e.target.value)}
              placeholder="https://enlace-de-tu-imagen.com/foto.jpg"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              {playlist ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};