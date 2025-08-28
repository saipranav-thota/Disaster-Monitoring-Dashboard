import React from 'react';
import './StatsOverlay.css';

const StatsOverlay = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={`stats-overlay ${isOpen ? 'open' : ''}`}>
      <div className="horizontal-tabs-container">
          <div className="tab-content">
            <div className="stat-card">
              <div className="stat-trend">Data will be added here</div>
              <div className="stat-number">--</div>
              <div className="stat-label">Tab 1 Content</div>
            </div>
          </div>
    
          <div className="tab-content">
            <div className="stat-card">
              <div className="stat-trend">Data will be added here</div>
              <div className="stat-number">--</div>
              <div className="stat-label">Tab 2 Content</div>
            </div>
          </div>
       
          <div className="tab-content">
            <div className="stat-card">
              <div className="stat-trend">Data will be added here</div>
              <div className="stat-number">--</div>
              <div className="stat-label">Tab 3 Content</div>
            </div>
          </div>

          <div className="tab-content">
            <div className="stat-card">
              <div className="stat-trend">Data will be added here</div>
              <div className="stat-number">--</div>
              <div className="stat-label">Tab 4 Content</div>
            </div>
          </div>

          <div className="tab-content">
            <div className="stat-card">
              <div className="stat-trend">Data will be added here</div>
              <div className="stat-number">--</div>
              <div className="stat-label">Tab 5 Content</div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default StatsOverlay;