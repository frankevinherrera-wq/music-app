// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuth from "../hooks/useAuth"; 
import { Waves, X } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Completá ambos campos.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/"); 
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error ? err.message : "Error al iniciar sesión.";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 antialiased">
      <div className="flex items-center gap-2 mb-8">
        <Waves className="h-8 w-8 text-green-500" />
        <span className="text-2xl font-black text-white tracking-wider">WAVE</span>
      </div>

      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-sm border border-gray-800 relative shadow-2xl">
        <button 
          type="button" 
          onClick={() => navigate("/")} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-white text-xl font-bold mb-6">Iniciar sesión</h2>
        
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 rounded-lg px-3 py-2 text-xs mb-4">
            ⚠️ {error}
          </div>
        )}
        
        <div className="mb-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-gray-950 p-3 rounded-lg text-white border border-gray-800 focus:outline-none focus:border-green-500 text-sm transition-colors" 
          />
        </div>
        
        <div className="mb-6">
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-gray-950 p-3 rounded-lg text-white border border-gray-800 focus:outline-none focus:border-green-500 text-sm transition-colors" 
          />
        </div>
        
        <button 
          type="button"
          onClick={handleSubmit} 
          disabled={cargando} 
          className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition-colors disabled:opacity-50 text-sm shadow-md"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
        
        <p className="text-gray-400 text-xs mt-6 text-center pt-4 border-t border-gray-800/60">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-green-400 font-semibold hover:underline">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
};