// components/Building.js
import React from 'react';
import cookieImage from '../images/cookie.png'; // Update path if needed
import '../Buildings.css';

const Building = ({ building, index, cookies, purchaseBuilding, formatNumber, hoveredUpgrade, setHoveredUpgrade, totalCPS }) => {
  return (
    <button
      key={index}
      onClick={() => {
        if (cookies >= building.cost) {
          purchaseBuilding(index);
        }
      }}
      onMouseEnter={() => setHoveredUpgrade(index)}
      onMouseLeave={() => setHoveredUpgrade(null)}
      disabled={cookies < building.cost}
      className={`building-item ${cookies < building.cost ? 'too-expensive' : ''}`}
    >
      <div className="building-number">{formatNumber(building.number)}</div>
      <div className="building-details">
        <p className="building-name">{building.name}</p>
        <p className="building-description">{building.description}</p>

        {hoveredUpgrade === index && (
          <div className="building-tooltip">
            <p><strong>CpS:</strong> {formatNumber(building.cps * building.number)}</p>
            <p><strong>Per {building.name}:</strong> {formatNumber(building.cps)} CpS</p>
            <p>
              <strong>Contribution:</strong>
              {totalCPS > 0 
                ? ((building.cps * building.number) / totalCPS * 100).toFixed(2) 
                : 0}% of total CpS
            </p>
          </div>
        )}
      </div>
      <div className="building-cost">
        {formatNumber(building.cost)} <img src={cookieImage} alt="Cookie" className="cookie-icon" />
      </div>
    </button>
  );
};

export default Building;