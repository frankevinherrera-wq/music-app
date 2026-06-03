// src/components/HeroBanner.tsx
import { Play, Pause, Shuffle } from "lucide-react"

const obtenerSaludo = () => {
  const hora = new Date().getHours()
  if (hora < 12) return "Buenos dias"
  if (hora < 19) return "Buenas tardes"
  return "Buenas noches"
}

interface HeroBannerProps {
  reproduciendo: boolean
  setReproduciendo: (valor: boolean) => void
}

export const HeroBanner = ({ reproduciendo, setReproduciendo }: HeroBannerProps) => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-surface-2 min-h-[220px]">
      <img
        src="/covers/hero-wave.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      <div className="relative flex flex-col gap-6 p-8 md:p-10">
        <p className="text-sm font-medium text-muted">{obtenerSaludo()}</p>
        <h1 className="max-w-md text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
          Escucha sin limites.
          <br />
          Siente la <span className="text-primary">Wave.</span>
        </h1>
        
        <div className="flex gap-3">
          <button
            onClick={() => setReproduciendo(!reproduciendo)}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105"
          >
            {reproduciendo ? (
              <>
                <Pause className="h-4 w-4 fill-background text-background" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-background text-background" />
                Reproducir
              </>
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-surface-3/80 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition-transform hover:scale-105"
          >
            <Shuffle className="h-4 w-4" />
            Aleatorio
          </button>
        </div>
      </div>
    </section>
  )
}