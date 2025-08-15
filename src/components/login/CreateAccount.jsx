import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function CreateAccount() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [roles] = useState([
        { value: 'ADMIN', name: 'Admin' },
        { value: 'SUPERVISOR', name: 'Supervisor' }
    ]);
    const [selectedRole, setSelectedRole] = useState(roles[0].value);
    const [email, setEmail] = useState('');

    async function handleRegister() {
      if (!username || !password || !confirmPassword) {
        alert("Veuillez renseigner tous les champs");
        return;
      }
      if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role: selectedRole, email: email || undefined })
        });
        if (!res.ok) throw new Error('Inscription échouée');
        const data = await res.json();
        // On connaît déjà le rôle choisi
        login(data.token, selectedRole, username);
        if (selectedRole === 'ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/supervisor/dashboard');
        }
      } catch (e) {
        alert(e.message || 'Erreur lors de la création de compte');
      }
    }


    return (
        <div className="flex bg-blue-100 flex-col min-h-screen w-full items-center justify-center">
            <main className="flex flex-col bg-white shadow-xl py-5 px-7 rounded-2xl w-[30%] gap-5">
                <h1 className="text-2xl font-bold">Creer votre compte</h1>
                <label htmlFor="username">Nom d'utilisateur</label>
                <input type="text" value={username} className="w-full p-3 border border-gray-300 rounded-md" onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="password">Mot de passe</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    className="w-full p-3 pr-10 border-gray-300 rounded-md border" 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmPassword} 
                    className="w-full p-3 pr-10 border-gray-300 rounded-md border" 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" onClick={() => setShowConfirmPassword(p => !p)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  value={selectedRole}
                  className="w-full p-3 border-gray-300 rounded-md border"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                    {roles.map((item) => (
                        <option key={item.value} value={item.value}>{item.name}</option>
                    ))}
                </select>
                <label htmlFor="email">Email (optionnel, requis pour récupérer le mot de passe)</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" placeholder="ex: utilisateur@exemple.com" />
                <p>Vous avez deja un compte ? <Link className='text-blue-500' to='/login'>Se connecter</Link></p>

                <button
                onClick={handleRegister}
                type="button" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition">Créer un compte</button>




            </main>
        </div>
    )
}