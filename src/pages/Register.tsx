// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { Waves, X } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [exito, setExito] = useState<boolean>(false);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    const { error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    setCargando(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    setExito(true);
  };

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 antialiased">
        <div className="flex items-center gap-2 mb-8">
          <Waves className="h-8 w-8 text-green-500" />
          <span className="text-2xl font-black text-white tracking-wider">WAVE</span>
        </div>

        <div className="bg-gray-900 p-8 rounded-xl w-full max-w-sm border border-gray-800 text-center shadow-2xl animate-fade-in">
          <h2 className="text-white text-xl font-bold mb-2">¡Cuenta creada!</h2>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            Tu cuenta fue creada correctamente en la plataforma WAVE. Ya puedes iniciar sesión para gestionar tu biblioteca.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition-colors text-sm shadow-lg"
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 antialiased">
      <div className="flex items-center gap-2 mb-8">
        <Waves className="h-8 w-8 text-green-500" />
        <span className="text-2xl font-black text-white tracking-wider">WAVE</span>
      </div>

      <form 
        onSubmit={handleRegistrar} 
        className="bg-gray-900 p-8 rounded-xl w-full max-w-sm border border-gray-800 relative shadow-2xl"
      >
        <button 
          type="button" 
          onClick={() => navigate("/")} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-white text-xl font-bold mb-6">Crear cuenta</h2>
        
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-400 rounded-lg px-3 py-2 text-xs mb-4">
            ⚠️ {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-400 text-xs font-semibold mb-1.5">Email</label>
          <input 
            type="email" 
            placeholder="usuario@ejemplo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-gray-950 p-3 rounded-lg text-white border border-gray-800 focus:outline-none focus:border-green-500 text-sm transition-colors" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-400 text-xs font-semibold mb-1.5">Contraseña</label>
          <input 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-gray-950 p-3 rounded-lg text-white border border-gray-800 focus:outline-none focus:border-green-500 text-sm transition-colors" 
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 text-xs font-semibold mb-1.5">Confirmar contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full bg-gray-950 p-3 rounded-lg text-white border border-gray-800 focus:outline-none focus:border-green-500 text-sm transition-colors" 
          />
        </div>
        
        <button 
          disabled={cargando} 
          className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition-colors disabled:opacity-50 text-sm shadow-md"
        >
          {cargando ? "Registrando..." : "Crear cuenta"}
        </button>
        
        <p className="text-gray-400 text-xs mt-6 text-center pt-4 border-t border-gray-800/60">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-green-400 font-semibold hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;