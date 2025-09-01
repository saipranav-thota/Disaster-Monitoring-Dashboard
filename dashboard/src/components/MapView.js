import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, CircleMarker } from 'react-leaflet';
import { cellToLatLng } from 'h3-js';
import apiService from '../services/api';
import './MapView.css';

const MapClickHandler = ({ setMap }) => {
  const map = useMapEvents({
    // Removed click handler - only fire markers should trigger location updates
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
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Function to categorize fire intensity and assign visual properties
  const categorizeFireIntensity = (frpIntensity) => {
    let intensityLevel = 'low';
    let color = '#ffeb3b'; // Yellow for low
    let radius = 8;

    if (frpIntensity > 100) {
      intensityLevel = 'medium';
      color = '#ff9800'; // Orange for medium
      radius = 12;
    }

    if (frpIntensity > 150) {
      intensityLevel = 'high';
      color = '#f44336'; // Red for high
      radius = 16;
    }

    if (frpIntensity > 200) {
      intensityLevel = 'extreme';
      color = '#b71c1c'; // Dark red for extreme
      radius = 20;
    }

    return { intensityLevel, color, radius };
  };

  // Function to process fire data for map visualization
  const processFireData = (rawFireData) => {
    return rawFireData.map(fire => {
      const [lat, lng] = cellToLatLng(fire.h3Index);
      const { intensityLevel, color, radius } = categorizeFireIntensity(fire.frpIntensity);

      return {
        ...fire,
        lat,
        lng,
        intensityLevel,
        color,
        radius
      };
    });
  };

  // Load fire data from API
  const loadFireData = async () => {
    setLoading(true);
    setError(null);

    try {
      const rawFireData = await apiService.getWildfiresH3Format(200);
      const processedData = processFireData(rawFireData);
      setFireData(processedData);
      
    } catch (err) {
      console.error('Error loading fire data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFireData();
  }, []);

  // Function to refresh data
  const refreshData = () => {
    loadFireData();
  };



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

  const handleFireMarkerClick = (fire) => {
    const locationData = {
      name: `Fire Detection - ${fire.intensityLevel.toUpperCase()}`,
      temperature: '85°F',
      humidity: '25%',
      windSpeed: '12 mph',
      riskLevel: fire.intensityLevel,
      activeFiresCount: 1,
      evacuationZones: fire.frpIntensity > 150 ? 1 : 0,
      resources: {
        helicopters: fire.frpIntensity > 200 ? 3 : fire.frpIntensity > 150 ? 2 : 1,
        fireTeams: fire.frpIntensity > 200 ? 5 : fire.frpIntensity > 150 ? 3 : 2
      },
      coordinates: { lat: fire.lat, lng: fire.lng },
      fireData: {
        h3Index: fire.h3Index,
        frpIntensity: fire.frpIntensity,
        timestamp: fire.timestamp
      }
    };

    onLocationClick(locationData);
  };

  return (
    <div className="map-view">
      {/* Map Controls */}
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
        <MapClickHandler setMap={setMap} />

        {/* Fire Markers based on H3 buckets and FRP intensity */}
        {fireData.map((fire, index) => (
          <CircleMarker
            key={`${fire.h3Index}-${index}`}
            center={[fire.lat, fire.lng]}
            radius={fire.radius}
            pathOptions={{
              color: fire.color,
              fillColor: fire.color,
              fillOpacity: 0.7,
              weight: 2
            }}
            eventHandlers={{
              click: () => handleFireMarkerClick(fire)
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
