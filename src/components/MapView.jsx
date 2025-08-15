import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function MapView({ infrastructures = [], onSelectInfra }) {
  const navigate = useNavigate();
  const [mapInstance, setMapInstance] = useState(null);

  // Centrer la carte sur les infrastructures si disponibles
  useEffect(() => {
    if (mapInstance && infrastructures.length > 0) {
      const bounds = L.latLngBounds(
        infrastructures
          .filter(infra => infra.latitude && infra.longitude)
          .map(infra => [infra.latitude, infra.longitude])
      );
      
      if (bounds.isValid()) {
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [mapInstance, infrastructures]);

  const handleMarkerClick = (infra) => {
    if (onSelectInfra) {
      onSelectInfra(infra);
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-300 shadow-md">
      <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
        ref={setMapInstance}
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
              eventHandlers={{
                click: () => handleMarkerClick(infra)
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{infra.nom}</h3>
                  <p className="text-sm">{infra.type} - {infra.zone}</p>
                  <p className="text-xs text-gray-600">{infra.adresse}</p>
                  <button 
                    onClick={() => navigate(`/infrastructure/${infra.id}/edit`)}
                    className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Détails
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}