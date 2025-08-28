import React from 'react';
import './Header.css';

const MapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const Header = ({ selectedLocation }) => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">
          <MapPin size={24} />
        </div>
        <div className="location-info">
          {selectedLocation ? (
            <div className="location-details">
              <span className="location-label">Selected Location:</span>
              <span className="location-coords">
                Lat: {selectedLocation.lat?.toFixed(4)}, Lng: {selectedLocation.lng?.toFixed(4)}
              </span>
            </div>
          ) : (
            <span className="location-placeholder"></span>
          )}
        </div>
      </div>
      
      <div className="header-right">
        <span className="system-title">Wildfire Monitoring System</span>
      </div>
    </div>
  );
};

export default Header;