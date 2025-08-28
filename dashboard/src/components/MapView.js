import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import './MapView.css';

// Mock data for different locations
const locationData = {
  'california': {
    name: 'California',
    temperature: '95°F',
    humidity: '15%',
    windSpeed: '25 mph',
    riskLevel: 'Extreme',
    activeFiresCount: 12,
    evacuationZones: 3,
    resources: {
      helicopters: 8,
      fireTeams: 15
    }
  },
  'texas': {
    name: 'Texas',
    temperature: '102°F',
    humidity: '12%',
    windSpeed: '18 mph',
    riskLevel: 'High',
    activeFiresCount: 6,
    evacuationZones: 1,
    resources: {
      helicopters: 4,
      fireTeams: 8
    }
  },
  'florida': {
    name: 'Florida',
    temperature: '88°F',
    humidity: '65%',
    windSpeed: '12 mph',
    riskLevel: 'Low',
    activeFiresCount: 1,
    evacuationZones: 0,
    resources: {
      helicopters: 2,
      fireTeams: 3
    }
  }
};

const MapClickHandler = ({ onLocationClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // Determine location based on coordinates (simplified)
      let location = 'default';
      if (lat > 32 && lat < 42 && lng > -124 && lng < -114) {
        location = 'california';
      } else if (lat > 25 && lat < 36 && lng > -106 && lng < -93) {
        location = 'texas';
      } else if (lat > 24 && lat < 31 && lng > -87 && lng < -80) {
        location = 'florida';
      }
      
      const data = locationData[location] || {
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
        }
      };
      
      onLocationClick({
        ...data,
        coordinates: { lat, lng }
      });
    }
  });
  
  return null;
};

const MapView = ({ onLocationClick }) => {
  const [mapType, setMapType] = useState('satellite');

  const mapTypes = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          key={mapType}
          url={mapTypes[mapType].url}
          attribution={mapTypes[mapType].attribution}
        />
        <MapClickHandler onLocationClick={onLocationClick} />
      </MapContainer>
      
      {/* Heat overlay simulation */}
      <div className="heat-overlay">
        <div className="heat-zone california"></div>
        <div className="heat-zone texas"></div>
        <div className="heat-zone arizona"></div>
        <div className="heat-zone nevada"></div>
      </div>
    </div>
  );
};

export default MapView;