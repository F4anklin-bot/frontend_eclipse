import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password || password !== confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/auth/reset-password?token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Mot de passe réinitialisé');
        navigate('/login');
      } else {
        alert('Lien invalide ou expiré');
      }
    } catch {
      alert('Erreur réseau');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">Réinitialiser le mot de passe</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Réinitialiser</button>
        </form>
        <div className="mt-4 text-sm"><Link className="text-blue-500" to="/login">Retour à la connexion</Link></div>
      </div>
    </div>
  );
}


