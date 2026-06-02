import { useState, useEffect, useRef } from "react"
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Volume2,
  MonitorSpeaker,
  ListMusic,
  Disc,
} from "lucide-react"
import type { Cancion } from "../types/Cancion"

const formatTime = (segundos: number) => {
  const mins = Math.floor(segundos / 60)
  const secs = Math.floor(segundos % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

interface PlayerProps {
  cancion: Cancion | null
  reproduciendo: boolean
  setReproduciendo: (valor: boolean) => void
  alAdelantar?: () => void
  alRetroceder?: () => void
  alAleatorio?: () => void
}

export const Player = ({ cancion, reproduciendo, setReproduciendo, alAdelantar, alRetroceder, alAleatorio }: PlayerProps) => {
  const [progreso, setProgreso] = useState(0)
  const [volumen, setVolumen] = useState(70)
  const [aleatorio, setAleatorio] = useState(false)
  const [repetir, setRepetir] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (cancion?.audio_url) {
      const audio = new Audio(cancion.audio_url)
      audio.volume = volumen / 100
      audio.loop = repetir

      const handleTimeUpdate = () => setProgreso(audio.currentTime)

      const handleEnded = () => {
        if (!audio.loop) {
          if (aleatorio && alAleatorio) {
            alAleatorio()
          } else if (alAdelantar) {
            alAdelantar()
          } else {
            setReproduciendo(false)
            setProgreso(0)
          }
        }
      }

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)
      audioRef.current = audio

      // Autoplay cuando llega una nueva cancion
      audio.play().catch((err) => console.error("Error al reproducir audio:", err))
      setReproduciendo(true)

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", handleEnded)
        audio.pause()
        audioRef.current = null
      }
    } else {
      setProgreso(0)
    }
  }, [cancion?.id, cancion?.audio_url])

  useEffect(() => {
    if (!audioRef.current) return
    if (reproduciendo) {
      audioRef.current.play().catch((err) => console.error("Error al reproducir:", err))
    } else {
      audioRef.current.pause()
    }
  }, [reproduciendo])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volumen / 100
  }, [volumen])

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = repetir
  }, [repetir])

  useEffect(() => {
    if (cancion?.audio_url || !reproduciendo || !cancion) return

    const intervalo = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= cancion.duracion) {
          if (aleatorio && alAleatorio) {
            alAleatorio()
          } else if (alAdelantar) {
            alAdelantar()
          } else {
            setReproduciendo(false)
          }
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [reproduciendo, cancion, cancion?.audio_url, alAdelantar, aleatorio, alAleatorio])

  if (!cancion) {
    return (
      <footer className="w-full bg-gray-950 border-t border-gray-800/60 py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
      <div className="flex items-center gap-2 text-center sm:text-left">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <p>Selecciona una canción para comenzar a reproducir</p>
      </div>
      
      <div className="flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity">
        <span className="font-black text-white tracking-widest text-[11px]">......WAVE</span>
      </div>
    </footer>
    )
  }

  const porcentaje = (progreso / cancion.duracion) * 100

  return (
    <footer className="flex items-center gap-4 border-t border-white/5 bg-surface-1 px-4 py-3 cursor-pointer">
      <div className="flex w-[30%] min-w-0 items-center gap-3">
        {cancion.portada ? (
          <img
            src={cancion.portada}
            alt={cancion.titulo}
            className="h-14 w-14 rounded-md object-cover shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 text-gray-500">
            <Disc className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{cancion.titulo}</p>
          <p className="truncate text-xs text-muted">{cancion.artista}</p>
        </div>
       
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 cursor-pointer">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              const nuevoAleatorio = !aleatorio
              setAleatorio(nuevoAleatorio)
              if (nuevoAleatorio && alAleatorio) alAleatorio()
            }}
            className={`transition-colors ${aleatorio ? "text-primary" : "text-muted hover:text-foreground"}`}
            title="Reproduccion aleatoria"
          >
            <Shuffle className="h-4 w-4" />
          </button>
          
          <button onClick={alRetroceder} className="text-muted transition-colors hover:text-foreground">
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          
          <button
            onClick={() => setReproduciendo(!reproduciendo)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
          >
            {reproduciendo ? (
              <Pause className="h-5 w-5 fill-background text-background" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5 fill-background text-background" />
            )}
          </button>
          
          <button onClick={alAdelantar} className="text-muted transition-colors hover:text-foreground">
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          
          <button
            onClick={() => setRepetir(!repetir)}
            className={`transition-colors ${repetir ? "text-primary" : "text-muted hover:text-foreground"}`}
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        <div className="flex w-full items-center gap-3">
          <span className="w-10 text-right text-xs tabular-nums text-muted">{formatTime(progreso)}</span>
          <input
            type="range"
            min={0}
            max={cancion.duracion}
            value={progreso}
            onChange={(e) => {
              const nuevoProgreso = Number(e.target.value)
              setProgreso(nuevoProgreso)
              if (audioRef.current) {
                audioRef.current.currentTime = nuevoProgreso
              }
            }}
            className="h-1 flex-1 cursor-pointer accent-primary bg-surface-3 rounded-lg appearance-none"
            style={{
              background: `linear-gradient(to right, #1db954 ${porcentaje}%, #333333 ${porcentaje}%)`,
            }}
          />
          <span className="w-10 text-xs tabular-nums text-muted">{formatTime(cancion.duracion)}</span>
        </div>
      </div>

      <div className="flex w-[30%] items-center justify-end gap-4">
     
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted" />
          <input
            type="range"
            min={0}
            max={100}
            value={volumen}
            onChange={(e) => setVolumen(Number(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-primary bg-surface-3 rounded-lg appearance-none"
            style={{
              background: `linear-gradient(to right, #1db954 ${volumen}%, #333333 ${volumen}%)`,
            }}
          />
        </div>
        
        <button className="text-muted transition-colors hover:text-foreground">
          <MonitorSpeaker className="h-4 w-4" />
        </button>
        <button className="text-muted transition-colors hover:text-foreground">
          <ListMusic className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}