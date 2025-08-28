import React, { useState } from 'react';
import MapView from './MapView';

import Header from './Header';
import StatsOverlay from './StatsOverlay';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMapClick = (locationData) => {
    setSelectedLocation(locationData);
    setSidebarOpen(true); // Open bottom tabs and keep them open
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="map-container">
          <MapView onLocationClick={handleMapClick} />
          <Header selectedLocation={selectedLocation} />
          <StatsOverlay isOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;