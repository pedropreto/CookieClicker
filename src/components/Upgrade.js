// components/Upgrade.js
import React from 'react';
import cookieImage from '../images/cookie.png'; // Update path if needed
import '../Upgrades.css';
import { formatNumber } from '../utils/helpers'; // Import from utils


const Upgrade = ({ upgrade, index, cookies, purchaseBuildingUpgrade, formatNumber }) => {
  const upgradeCost = upgrade.baseCost * Math.pow(2, upgrade.purchasedAt.length);

  return (
    <button
      key={index}
      onClick={() => purchaseBuildingUpgrade(index)}
      disabled={cookies < upgradeCost}
      className="upgrade-item"
    >
      <div className="upgrade-name">
        {upgrade.name} (x{upgrade.cpsMultiplier})
      </div>
      <div className="upgrade-cost">
        {formatNumber(upgradeCost)} <img src={cookieImage} alt="Cookie" className="cookie-icon" />
      </div>
    </button>
  );
};

export default Upgrade;