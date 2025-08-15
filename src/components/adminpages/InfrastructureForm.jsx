import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour les icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Coordonnées par défaut pour Lomé, Togo
const DEFAULT_CENTER = [6.1319, 1.2228];
const DEFAULT_ZOOM = 13;

// Composant pour gérer le marqueur et les événements de la carte
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function InfrastructureForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [type, setType] = useState('Marché');
  const [status, setStatus] = useState('Actif');
  const [zone, setZone] = useState('Centre-ville');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    async function load() {
      if (!isEditMode || !token) return;
      
      // Ajout d'un petit délai pour s'assurer que le composant est bien monté
      setTimeout(async () => {
        try {
          console.log('Fetching infrastructure data for ID:', id);
          const res = await fetch(`http://localhost:8080/api/infrastructures/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            console.log('Infrastructure data loaded:', data); // Ajout de log pour déboguer
            
            // Mise à jour des états avec les données récupérées
            setName(data.nom || '');
            setType(data.type || 'Marché');
            setStatus(data.statut || 'Actif');
            setZone(data.zone || 'Centre-ville');
            setAddress(data.adresse || '');
            
            if (data.latitude && data.longitude) {
              setLatitude(data.latitude);
              setLongitude(data.longitude);
              setPosition([data.latitude, data.longitude]);
            }
          } else {
            console.error('Failed to load infrastructure data, status:', res.status);
          }
        } catch (error) {
          console.error('Error loading infrastructure data:', error);
        }
      }, 300); // Délai de 300ms
    }
    load();
  }, [id, isEditMode, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) return;
    const confirmed = window.confirm(isEditMode ? 'Voulez-vous enregistrer les modifications de cette infrastructure ?' : "Voulez-vous créer cette infrastructure ?");
    if (!confirmed) return;
    const payload = {
      nom: name,
      type,
      statut: status,
      zone,
      adresse: address,
      latitude: latitude,
      longitude: longitude
    };
    try {
      const res = await fetch(`http://localhost:8080/api/infrastructures${isEditMode ? `/${id}` : ''}` , {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        navigate('/infrastructure');
      } else {
        alert("Enregistrement échoué");
      }
    } catch (e) {
      alert('Erreur réseau');
    }
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
        {/* Carte pour sélectionner l'emplacement */}
        <div className="mb-4">
          <label className="mb-1 font-medium">Localisation sur la carte</label>
          <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
            <MapContainer 
              center={position || DEFAULT_CENTER} 
              zoom={DEFAULT_ZOOM} 
              style={{ height: '100%', width: '100%' }}
              key={position ? `${position[0]}-${position[1]}` : 'default'}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <LocationMarker 
                position={position}
                setPosition={(pos) => {
                  setPosition(pos);
                  setLatitude(pos[0]);
                  setLongitude(pos[1]);
                }}
              />
            </MapContainer>
          </div>
          <p className="text-sm text-gray-500 mt-1">Cliquez sur la carte pour définir l'emplacement</p>
        </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Latitude</label>
            <input 
              type="number" 
              step="0.0000001"
              value={latitude || ''} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLatitude(val);
                if (longitude) setPosition([val, longitude]);
              }} 
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" 
              placeholder="Ex: 6.1319"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Longitude</label>
            <input 
              type="number" 
              step="0.0000001"
              value={longitude || ''} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLongitude(val);
                if (latitude) setPosition([latitude, val]);
              }} 
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300" 
              placeholder="Ex: 1.2228"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => navigate('/infrastructure')} className="px-4 py-2 rounded-lg border">Annuler</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">{isEditMode ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </form>
    </div>
  );
}


