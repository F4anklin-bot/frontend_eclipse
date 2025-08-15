import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">Mot de passe oublié</h1>
        <p className="text-gray-600 mb-4">Entrez votre email. Si un compte existe, un lien de réinitialisation vous sera envoyé.</p>
        {sent ? (
          <div className="text-green-600 mb-4">Si l'email existe, un message a été envoyé.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 disabled:opacity-60 text-white py-2 rounded-lg">{loading ? 'Envoi...' : 'Envoyer le lien'}</button>
          </form>
        )}
        <div className="mt-4 text-sm"><Link className="text-blue-500" to="/login">Retour à la connexion</Link></div>
      </div>
    </div>
  );
}


