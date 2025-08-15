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

export default function InfrastructureDetailMap({ infrastructure }) {
  // Vérifier si l'infrastructure a des coordonnées valides
  const hasCoordinates = infrastructure && 
                        infrastructure.latitude && 
                        infrastructure.longitude;
  
  // Position pour le marqueur
  const position = hasCoordinates ? 
                  [infrastructure.latitude, infrastructure.longitude] : 
                  DEFAULT_CENTER;

  if (!hasCoordinates) {
    return (
      <div className="bg-white rounded-lg p-4 text-center">
        <p className="text-gray-600">Aucune coordonnée géographique disponible pour cette infrastructure.</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 shadow-md">
      <MapContainer 
        center={position} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{infrastructure.nom}</h3>
              <p className="text-sm">{infrastructure.type} - {infrastructure.zone}</p>
              <p className="text-xs text-gray-600">{infrastructure.adresse}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}