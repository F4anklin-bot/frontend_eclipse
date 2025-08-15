import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function EquipementForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [infrastructure, setInfrastructure] = useState('Marché Central');
  const [type, setType] = useState('Étal');
  const [statut, setStatut] = useState('Libre');
  const [occupant, setOccupant] = useState('');
  const [redevance, setRedevance] = useState('');

  useEffect(() => {
    if (isEditMode) {
      // TODO: Charger les données depuis l'API en fonction de l'id
      setName(`Équipement #${id}`);
      setDescription('Description de démonstration');
      setInfrastructure('Marché Central');
      setType('Étal');
      setStatut('Occupé');
      setOccupant('Exemple');
      setRedevance('10000');
    }
  }, [id, isEditMode]);

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: POST/PUT/PATCH vers l'API
    navigate('/equipement');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{isEditMode ? "Modifier un équipement" : "Ajouter un équipement"}</h1>
          <p className="text-gray-500">Renseignez les informations ci-dessous</p>
        </div>
        <Link to="/equipement" className="text-blue-600 hover:underline">Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Étal</option>
              <option>Box commercial</option>
              <option>Quai</option>
              <option>Dock</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Infrastructure</label>
            <select value={infrastructure} onChange={(e) => setInfrastructure(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Marché Central</option>
              <option>Gare Routière Nord</option>
              <option>Port de Commerce</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Statut</label>
            <select value={statut} onChange={(e) => setStatut(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Occupé</option>
              <option>Libre</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Redevance (F/mois)</label>
            <input type="number" value={redevance} onChange={(e) => setRedevance(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Occupant</label>
            <input value={occupant} onChange={(e) => setOccupant(e.target.value)} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => navigate('/equipement')} className="px-4 py-2 rounded-lg border">Annuler</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">{isEditMode ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </form>
    </div>
  );
}


