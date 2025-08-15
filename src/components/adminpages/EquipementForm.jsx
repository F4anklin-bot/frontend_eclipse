import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function EquipementForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [infrastructure, setInfrastructure] = useState('');
  const [infrastructures, setInfrastructures] = useState([]);
  const [type, setType] = useState('Étal');
  const [statut, setStatut] = useState('Libre');
  const [occupant, setOccupant] = useState('');
  const [redevance, setRedevance] = useState('');

  useEffect(() => {
    // Charger les infrastructures pour choisir par nom mais soumettre par id
    async function loadInfras() {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:8080/api/infrastructures', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setInfrastructures(data);
        }
      } catch (e) { console.error('Failed to load infrastructures', e); }
    }
    loadInfras();

    async function load() {
      if (!isEditMode || !token) return;
      
      // Ajout d'un petit délai pour s'assurer que le composant est bien monté
      setTimeout(async () => {
        try {
          console.log('Fetching equipment data for ID:', id);
          const res = await fetch(`http://localhost:8080/api/equipements/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            console.log('Equipement data loaded:', data); // Ajout de log pour déboguer
            
            // Mise à jour des états avec les données récupérées
            setName(data.nom || '');
            setDescription(data.description || '');
            setInfrastructure(data.infrastructure?.id ? String(data.infrastructure.id) : '');
            setType(data.type || 'Étal');
            setStatut(data.statut || 'Libre');
            setOccupant(data.occupant || '');
            setRedevance(String(data.redevance || ''));
          } else {
            console.error('Failed to load equipment data, status:', res.status);
          }
        } catch (e) { 
          console.error('Failed to load equipment', e); 
        }
      }, 300); // Délai de 300ms
    }
    load();
  }, [id, isEditMode, token]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Le nom est requis";
    if (!infrastructure) newErrors.infrastructure = "L'infrastructure est requise";
    if (statut === "Occupé" && !occupant.trim()) newErrors.occupant = "L'occupant est requis pour un équipement occupé";
    if (redevance && isNaN(Number(redevance))) newErrors.redevance = "La redevance doit être un nombre valide";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) return;
    
    // Validation du formulaire
    if (!validateForm()) {
      alert("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    const confirmed = window.confirm(isEditMode ? 'Voulez-vous enregistrer les modifications de cet équipement ?' : "Voulez-vous créer cet équipement ?");
    if (!confirmed) return;
    
    setIsSubmitting(true);
    
    const payload = {
      nom: name.trim(),
      description: description.trim(),
      type,
      statut,
      occupant: occupant.trim(),
      redevance: redevance ? Number(redevance) : null,
      infrastructure: infrastructure ? { id: Number(infrastructure) } : null
    };
    
    try {
      const res = await fetch(`http://localhost:8080/api/equipements${isEditMode ? `/${id}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(isEditMode ? "Équipement modifié avec succès" : "Équipement créé avec succès");
        navigate('/equipement');
      } else {
        const errorData = await res.json().catch(() => null);
        console.error('Erreur lors de l\'enregistrement:', res.status, errorData);
        alert(`Enregistrement échoué: ${errorData?.message || res.statusText || 'Erreur serveur'}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
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
            <label className="mb-1 font-medium">Nom <span className="text-red-500">*</span></label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300`} 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Type <span className="text-red-500">*</span></label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option>Étal</option>
              <option>Box commercial</option>
              <option>Quai</option>
              <option>Dock</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description</label>
          <input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Infrastructure <span className="text-red-500">*</span></label>
            <select 
              value={infrastructure} 
              onChange={(e) => setInfrastructure(e.target.value)} 
              className={`border ${errors.infrastructure ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300`}
            >
              <option value="">-- Sélectionner --</option>
              {infrastructures.map((inf) => (
                <option key={inf.id} value={String(inf.id)}>{inf.nom}</option>
              ))}
            </select>
            {errors.infrastructure && <p className="text-red-500 text-sm mt-1">{errors.infrastructure}</p>}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Statut <span className="text-red-500">*</span></label>
            <select 
              value={statut} 
              onChange={(e) => setStatut(e.target.value)} 
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option>Occupé</option>
              <option>Libre</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Redevance (F/mois)</label>
            <input 
              type="number" 
              value={redevance} 
              onChange={(e) => setRedevance(e.target.value)} 
              className={`border ${errors.redevance ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300`} 
            />
            {errors.redevance && <p className="text-red-500 text-sm mt-1">{errors.redevance}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Occupant {statut === "Occupé" && <span className="text-red-500">*</span>}</label>
            <input 
              value={occupant} 
              onChange={(e) => setOccupant(e.target.value)} 
              className={`border ${errors.occupant ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300`} 
            />
            {errors.occupant && <p className="text-red-500 text-sm mt-1">{errors.occupant}</p>}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button 
            type="button" 
            onClick={() => navigate('/equipement')} 
            className="px-4 py-2 rounded-lg border"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Traitement en cours...' : (isEditMode ? 'Enregistrer' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
}


