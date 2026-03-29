import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getMeetupLocationsAPI } from '../../api/axios.js';
import { FiMapPin } from 'react-icons/fi';

const MeetupMap = ({ onSelectLocation, selectedLocation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const SHUATS_CENTER = [25.4358, 81.8463];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await getMeetupLocationsAPI();
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Fetch locations error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading map...</p>;

  return (
    <div>
      <MapContainer center={SHUATS_CENTER} zoom={16} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {locations.map((loc) => (
          <Marker key={loc._id} position={[loc.coordinates.lat, loc.coordinates.lng]}>
            <Popup>
              <div>
                <h4>{loc.name}</h4>
                <p>{loc.description}</p>
                <p>Type: {loc.type}</p>
                {loc.isSafe && <span>✅ Safe Zone</span>}
                {onSelectLocation && (
                  <button onClick={() => onSelectLocation(loc)}>
                    <FiMapPin /> Select This Location
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div>
        <h4>Available Meetup Points:</h4>
        {locations.map((loc) => (
          <div
            key={loc._id}
            onClick={() => onSelectLocation && onSelectLocation(loc)}
            data-selected={selectedLocation?._id === loc._id}
          >
            <FiMapPin />
            <div>
              <span>{loc.name}</span>
              <span>{loc.type}</span>
            </div>
            {loc.isSafe && <span>✅</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetupMap;