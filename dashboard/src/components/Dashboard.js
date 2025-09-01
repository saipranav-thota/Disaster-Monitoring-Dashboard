import React, { useState } from 'react';
import MapView from './MapView';
import Header from './Header';
import StatsOverlay from './StatsOverlay';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMapClick = (locationData) => {
    // Only update location and open sidebar if it's a fire hotspot
    if (locationData && locationData.fireData) {
      setSelectedLocation(locationData);
      setSidebarOpen(true);
    } else {
      // Clear selection and close sidebar for non-fire clicks
      setSelectedLocation(null);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="map-container">
          <MapView onLocationClick={handleMapClick} />
          <Header selectedLocation={selectedLocation} />
          <StatsOverlay isOpen={sidebarOpen} selectedLocation={selectedLocation} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;