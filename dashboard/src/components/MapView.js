import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import './MapView.css';

const MapClickHandler = ({ onLocationClick, setMap }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;

      const data = {
        name: 'Unknown Location',
        temperature: '78°F',
        humidity: '45%',
        windSpeed: '8 mph',
        riskLevel: 'Moderate',
        activeFiresCount: 2,
        evacuationZones: 0,
        resources: {
          helicopters: 1,
          fireTeams: 2
        },
        coordinates: { lat, lng }
      };

      onLocationClick(data);
    }
  });

  // Set the map reference when component mounts
  React.useEffect(() => {
    if (setMap) {
      setMap(map);
    }
  }, [map, setMap]);

  return null;
};

const MapView = ({ onLocationClick }) => {
  const [mapType, setMapType] = useState('satellite');
  const [map, setMap] = useState(null);

  const mapTypes = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  return (
    <div className="map-view">
      {/* Map Type Selector */}
      <div className="map-controls">
        <div className="map-type-selector">
          {Object.keys(mapTypes).map((type) => (
            <button
              key={type}
              className={`map-type-btn ${mapType === type ? 'active' : ''}`}
              onClick={() => setMapType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
          +
        </button>
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
          −
        </button>
      </div>

      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={2}
        className="map-fullscreen"
        zoomControl={false}
      >
        <TileLayer
          key={mapType}
          url={mapTypes[mapType].url}
          attribution={mapTypes[mapType].attribution}
        />
        <MapClickHandler onLocationClick={onLocationClick} setMap={setMap} />
      </MapContainer>
    </div>
  );
};

export default MapView;
