import React, { useState, useEffect } from 'react';
import './Header.css';

const MapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Header = ({ selectedLocation }) => {
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reverse geocoding function
  const getLocationName = async (lat, lng) => {
    setIsLoading(true);
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const { state, country } = data.address;
        const locationString = state && country ? `${state}, ${country}` :
          state ? state :
            country ? country : 'Unknown Location';
        setLocationName(locationString);
      } else {
        setLocationName('Unknown Location');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocationName('Location Unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch location when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && selectedLocation.fireData && selectedLocation.coordinates) {
      const { lat, lng } = selectedLocation.coordinates;
      getLocationName(lat, lng);
    } else {
      setLocationName('');
    }
  }, [selectedLocation]);

  return (
    <div className="header">
      <div className="header-left">

        <div className="location-info">
          {locationName && selectedLocation?.coordinates ? (
            <div className="location-details">
              <div className="logo">
                <MapPin className="map-icon" />
                <div class="location-text">
                  <span className="location-label">
                    {locationName}
                  </span>
                  <span className="location-coords">
                    Lat: {selectedLocation.coordinates.lat.toFixed(2)},
                    Lng: {selectedLocation.coordinates.lng.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

        </div>
      </div>

      <div className="header-right">
        <span className="system-title">Wildfire Monitoring System</span>
      </div>
    </div>
  );
};

export default Header;