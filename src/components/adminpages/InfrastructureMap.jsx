import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function InfrastructureMap() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [infrastructures, setInfrastructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInfrastructures() {
      if (!token) return;
      
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/api/infrastructures', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setInfrastructures(data);
        } else {
          setError('Erreur lors du chargement des infrastructures');
        }
      } catch (err) {
        console.error('Failed to load infrastructures', err);
        setError('Erreur réseau lors du chargement des infrastructures');
      } finally {
        setLoading(false);
      }
    }
    
    loadInfrastructures();
  }, [token]);

  const getStatusColor = (statut) => {
    switch(statut) {
      case "Actif": return "bg-green-500";
      case "Maintenance": return "bg-yellow-500";
      case "Fermé": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const hasCoordinates = infrastructures.some(infra => infra.latitude && infra.longitude);

  if (!hasCoordinates) {
    return (
      <div className="text-center p-4">
        <p>Aucune infrastructure n'a de coordonnées géographiques définies.</p>
        <p className="mt-2">Ajoutez des coordonnées aux infrastructures pour les voir sur la carte.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] w-full rounded-lg overflow-hidden border border-gray-300 shadow-md">
      <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
        whenReady={(map) => {
          // Centrer la carte sur les infrastructures si disponibles
          if (infrastructures.length > 0) {
            const bounds = L.latLngBounds(
              infrastructures
                .filter(infra => infra.latitude && infra.longitude)
                .map(infra => [infra.latitude, infra.longitude])
            );
            
            if (bounds.isValid()) {
              map.target.fitBounds(bounds, { padding: [50, 50] });
            }
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {infrastructures
          .filter(infra => infra.latitude && infra.longitude)
          .map(infra => (
            <Marker 
              key={infra.id} 
              position={[infra.latitude, infra.longitude]}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{infra.nom}</h3>
                  <p className="text-sm">{infra.type} - {infra.zone}</p>
                  <p className="text-xs text-gray-600">{infra.adresse}</p>
                  <div className="mt-2 flex justify-center space-x-2">
                    <span className={`${getStatusColor(infra.statut)} text-white px-2 py-1 rounded-full text-xs`}>
                      {infra.statut}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate(`/infrastructure/${infra.id}/edit`)}
                    className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}