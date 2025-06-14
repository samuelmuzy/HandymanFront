// MapaBusca.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Componente para mudar a posição do mapa dinamicamente
function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

const MapaBusca = () => {
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState<LatLngExpression>([-21.1307, -42.3697]); // Muriaé - default

  const handleSearch = async () => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
    } else {
      alert('Endereço não encontrado');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Digite o endereço (ex: Rua São Pedro, Muriaé)"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%' }}>
        <ChangeView center={position} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>Local encontrado</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapaBusca;
