import React, { useState, useEffect } from 'react';
import './StatsOverlay.css';

const StatsOverlay = ({ isOpen, selectedLocation }) => {
  const [showWithDelay, setShowWithDelay] = useState(false);

  useEffect(() => {
    if (isOpen && selectedLocation && selectedLocation.fireData) {
      const timer = setTimeout(() => {
        setShowWithDelay(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setShowWithDelay(false);
    }
  }, [isOpen, selectedLocation]);

  if (!isOpen || !selectedLocation || !selectedLocation.fireData) return null;

  const { fireData } = selectedLocation;

  return (
    <div className={`stats-overlay ${showWithDelay ? 'open' : ''}`}>
      <div className="horizontal-tabs-container">
        {/* Tab 1: FRP Index */}
        <div className="tab-content">
          <div className="stat-card frp-card">
            <div className="stat-trend">Fire Radiative Power</div>
            <div className="stat-number frp-number">{fireData.frpIntensity.toFixed(1)}</div>
            <div className="stat-label">MW</div>
            <div className="stat-sublabel">H3: {fireData.h3Index.slice(-6)}</div>
            <div className="intensity-bar">
              <div
                className="intensity-fill"
                style={{
                  width: `${Math.min((fireData.frpIntensity / 250) * 100, 100)}%`,
                  backgroundColor: fireData.frpIntensity > 200 ? '#b71c1c' :
                    fireData.frpIntensity > 150 ? '#f44336' :
                      fireData.frpIntensity > 100 ? '#ff9800' : '#ffeb3b'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tab 2: Risk Level */}
        <div className="tab-content">
          <div className={`stat-card risk-card ${selectedLocation.riskLevel.toLowerCase()}-risk`}>
            <div className="stat-trend">Risk Assessment</div>
            <div className="stat-number risk-number">{selectedLocation.riskLevel.toUpperCase()}</div>
            <div className="stat-label">Risk Level</div>
            <div className="stat-sublabel">
              {fireData.frpIntensity > 200 ? 'Extreme Danger' :
                fireData.frpIntensity > 150 ? 'High Risk' :
                  fireData.frpIntensity > 100 ? 'Moderate Risk' : 'Low Risk'}
            </div>
          </div>
        </div>

        {/* Tab 3: Last Updated */}
        <div className="tab-content">
          <div className="stat-card time-card">
            <div className="stat-trend">Detection Time</div>
            <div className="stat-number time-number">{new Date(fireData.timestamp).toLocaleTimeString()}</div>
            <div className="stat-label">Last Updated</div>
            <div className="stat-sublabel">{new Date(fireData.timestamp).toLocaleDateString()}</div>
            <div className="time-indicator">
              <div className="pulse-dot"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverlay;


