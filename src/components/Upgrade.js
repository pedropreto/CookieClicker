// components/Upgrade.js
import React, { useState } from 'react';
import '../Upgrades.css';
import cookieImage from '../images/cookie.png';


const Upgrade = ({ upgrade, cookies, purchaseBuildingUpgrade, formatNumber }) => {
    // Destructure the properties
    const { name, effect, baseCost, icon, description, purchasedAt } = upgrade;

    // Calculate the current cost of the upgrade
    const upgradeCost = baseCost * Math.pow(1.2, purchasedAt.length);

    // Check if the upgrade is affordable
    const canAfford = cookies >= upgradeCost;

    // If the upgrade has already been purchased, don't display it
    if (purchasedAt.length > 0) return null;

    return (
        <div
            className={`upgrade-item-container ${!canAfford ? 'too-expensive' : ''}`}
            onClick={() => canAfford && purchaseBuildingUpgrade(upgrade)}
        >
            <div className="upgrade-item">
                <div className="upgrade-icon">
                    {/* Display the icon for the upgrade */}
                    <img src={icon} alt={name} />
                </div>

                {/* Tooltip */}
                <div className="tooltip-upgrade">
                    <span className="tooltip-upgrade-name">{name}</span>
                    <div className="tooltip-upgrade-cost">
                        {formatNumber(upgradeCost)} <img src={cookieImage} alt="Cookie" className="cookie-icon" />
                    </div>
                    <p className="tooltip-upgrade-description">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default Upgrade;