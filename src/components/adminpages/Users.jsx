import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Trash2, Shield } from 'lucide-react';

export default function Users() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('TOUS');

  useEffect(() => {
    async function load() {
      if (!token) return;
      const res = await fetch('http://localhost:8080/api/users', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsers(await res.json());
    }
    load();
  }, [token]);

  const filtered = useMemo(() => users.filter(u => {
    const okSearch = u.username.toLowerCase().includes(search.toLowerCase());
    const okRole = roleFilter === 'TOUS' || u.role === roleFilter;
    return okSearch && okRole;
  }), [users, search, roleFilter]);

  async function handleDelete(userId) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== userId));
    else alert('Suppression échouée');
  }

  async function updateRole(userId, newRole) {
    const res = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } else {
      alert('Mise à jour du rôle échouée');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom"
            className="border rounded-lg p-2"
          />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border rounded-lg p-2">
            <option value="TOUS">Tous rôles</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPERVISOR">Superviseur</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Nom d'utilisateur</th>
              <th className="text-left p-3">Rôle</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.username}</td>
                <td className="p-3">
                  <select value={u.role} onChange={e => updateRole(u.id, e.target.value)} className="border rounded p-1">
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERVISOR">Superviseur</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800 inline-flex items-center gap-1">
                    <Trash2 size={16} /> Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">Aucun utilisateur</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


