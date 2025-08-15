import { ArrowDown, Store, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

import { useState } from 'react';
import commune from '../../assets/lacommune.jpg';
import form1 from '../../assets/form.webp';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Identifiants invalides');
      const data = await res.json();
      login(data.token, data.role, username);
      if (data.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/supervisor/dashboard');
      }
    } catch (e) {
      alert(e.message || 'Erreur de connexion');
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="flex items-center text-xl font-bold gap-2">
            <Store className="text-blue-400" /> GesMarche
          </h1>
          <a
            href="#form"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition"
          >
            Se connecter
          </a>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative h-[80vh] flex items-center justify-center bg-center bg-cover"
          style={{ backgroundImage: `url(${commune})` }}
        >
          <div className="relative z-10 bg-white/25 backdrop-blur-md rounded-xl p-8 text-center max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-2">GesMarche</h2>
            <p className="text-white/90">Gérer infrastructures et équipements en toute transparence et rapidement</p>
          </div>
          <div className="absolute top-8 right-8 w-12 h-12 bg-blue-200 rounded-full animate-ping" />
          <a
            href="#form"
            className="absolute bottom-10 text-white bg-blue-500 hover:animate-none animate-bounce p-3 rounded-full"
          >
            <ArrowDown />
          </a>
        </section>

        {/* Login Form Section */}
        <section id="form" className="py-16 bg-gray-50">
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 px-4">
            <div className="w-full lg:w-1/2">
              <img src={form1} alt="Illustration de connexion" className="w-full rounded-xl shadow-lg" />
            </div>
            <form onSubmit={handleSubmit} className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg space-y-6">
              <h2 className="flex items-center text-2xl font-bold gap-2">
                <Store className="text-blue-400" /> Connectez-vous
              </h2>

              <div className="flex flex-col">
                <label htmlFor="username" className="mb-1 font-medium">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="mb-1 font-medium">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition"
              >
                Se connecter
              </button>
              <div className="flex justify-between text-sm">
                <Link className="text-blue-500" to="/forgot-password">Mot de passe oublié ?</Link>
              </div>
              <p>Vous n'avez pas encore de compte ? <Link className="text-blue-500" to="/create-account">Creer un compte</Link></p>

            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
