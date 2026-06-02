// src/context/MusicContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import { useSong } from "../hooks/useSong"; 

type MusicContextType = ReturnType<typeof useSong>;

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const musicValue = useSong();

  return (
    <MusicContext.Provider value={musicValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic debe usarse dentro de MusicProvider");
  return ctx;
};