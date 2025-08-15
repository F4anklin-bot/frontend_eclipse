import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function InfrastructureForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [type, setType] = useState('Marché');
  const [status, setStatus] = useState('Actif');
  const [zone, setZone] = useState('Centre-ville');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (isEditMode) {
      // TODO: Charger les données depuis l'API en fonction de l'id
      // Valeurs de démonstration pour l'édition
      setName(`Infrastructure #${id}`);
      setType('Marché');
      setStatus('Actif');
      setZone('Centre-ville');
      setAddress('Adresse de démonstration');
    }
  }, [id, isEditMode]);

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: Appeler l'API (POST si ajout, PUT/PATCH si édition)
    navigate('/infrastructure');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Modifier une infrastructure' : 'Ajouter une infrastructure'}</h1>
          <p className="text-gray-500">Renseignez les informations ci-dessous</p>
        </div>
        <Link to="/infrastructure" className="text-blue-600 hover:underline">Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Marché</option>
              <option>Gare routière</option>
              <option>Abattoir</option>
              <option>Port</option>
              <option>Parking</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Actif</option>
              <option>Maintenance</option>
              <option>Fermé</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Zone</label>
            <select value={zone} onChange={(e) => setZone(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Centre-ville</option>
              <option>Zone industrielle</option>
              <option>Périphérie</option>
              <option>Zone Nord</option>
              <option>Zone Portuaire</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Adresse</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => navigate('/infrastructure')} className="px-4 py-2 rounded-lg border">Annuler</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">{isEditMode ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </form>
    </div>
  );
}


