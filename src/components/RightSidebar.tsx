import { useMusic } from "../context/MusicContext"
import { Disc } from "lucide-react"

export const RightSidebar = () => {
  const { cancionActual, canciones = [], alLeDarPlay } = useMusic()

  return (
    <aside className="hidden w-80 fflex-col gap-4 overflow-y-auto p-4 xl:flex bg-background border-l border-white/5">
      <section className="rounded-2xl bg-surface-1 p-4">
        <h2 className="mb-4 text-base font-bold text-foreground">Fila de reproducción (En la nube)</h2>
        
        <div className="flex flex-col gap-1">
          {canciones.length === 0 ? (
            <p className="text-xs text-muted italic">No hay canciones cargadas.</p>
          ) : (
            canciones.slice(0, 5).map((tema) => { 
              const activa = cancionActual !== null && tema.id === cancionActual.id
              
              return (
                <button
                  key={tema.id}
                  onClick={() => alLeDarPlay(tema)}
                  className={`flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-2 ${
                    activa ? "bg-surface-2" : ""
                  }`}
                >
                  {tema.portada ? (
                    <img
                      src={tema.portada}
                      className="h-10 w-10 rounded-md object-cover shrink-0"
                      alt={tema.titulo}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 text-gray-500">
                      <Disc className="h-5 w-5" />
                    </div>
                  )}
                  
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${activa ? "text-primary" : "text-foreground"}`}>
                      {tema.titulo}
                    </p>
                    <p className="truncate text-xs text-muted">{tema.artista}</p>
                  </div>
              
                </button>
              )
            })
          )}
        </div>
      </section>
    </aside>
  )
}