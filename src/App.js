import React, { useState, useEffect } from 'react';
import './CookieSide.css';
import './Button.css';
import './Layout.css';
import cookieImage from './images/cookie.png';

import { formatNumber } from './utils/helpers'; // Import from utils
import Header from './components/Header';
import Footer from './components/Footer';
import Building from './components/Building';
import Upgrade from './components/Upgrade';

// Import building and upgrade data from external files
import { buildings as initialBuildings } from './data/buildingsData';
import { buildingUpgrades as initialBuildingUpgrades } from './data/upgradesData';
import { click } from '@testing-library/user-event/dist/click';


function App() {
  const initialClickValue = 100

  const [cookies, setCookies] = useState(0);
  const [clickValue, setClickValue] = useState(initialClickValue); // Value of each manual click
  const [totalCPS, setTotalCPS] = useState(0); // Total CPS (sum of all upgrades)
  const [cookieOverflow, setCookieOverflow] = useState(0); // Accumulates fractional cookies
  const [hoveredUpgrade, setHoveredUpgrade] = useState(null); // Track hovered upgrade index
  const [buildings, setBuildings] = useState(initialBuildings);  // Building data from file
  const [buildingUpgrades, setBuildingUpgrades] = useState(initialBuildingUpgrades);  // Upgrade data from file
  const [manualCursor, setManualCursor] = useState({
    baseValue: 1, // Initial base value for manual clicks
    multiplier: 1, // Initial multiplier (will increase with upgrades)
    percentageOfCPS: 0, // Percentage of total CPS applied to click value
});




  // when you click manually on the element (cookie)
  const handleClick = () => {
    setCookies(prev => prev + clickValue);
  };

  const updateManualCursor = (upgrades, totalCPS) => {
    let cursorMultiplier = manualCursor.multiplier;
    let percentageOfCPS = manualCursor.percentageOfCPS;

    // Loop through cursor-related upgrades
    upgrades.forEach(upgrade => {
        if (upgrade.building === "Cursor" && upgrade.purchasedAt.length > 0) {
            cursorMultiplier *= upgrade.multiplier; // Apply the multiplier from each upgrade
            percentageOfCPS += upgrade.cpsPercentage || 0; // Increase percentage if upgrade adds CPS
        }
    });

    // Update the manualCursor object
    setManualCursor({
        baseValue: initialClickValue, // Base value for clicks, could increase with some upgrades
        multiplier: cursorMultiplier,
        percentageOfCPS: percentageOfCPS,
    });
};

useEffect(() => {
  updateManualCursor(buildingUpgrades, totalCPS); // Update when building upgrades or totalCPS changes
}, [buildingUpgrades, totalCPS]); // Trigger whenever these dependencies change


// Recalculate the click value when manualCursor or totalCPS changes
useEffect(() => {
  const newClickValue = (manualCursor.baseValue * manualCursor.multiplier) + (manualCursor.percentageOfCPS * totalCPS);
  
  // Update the click value state
  setClickValue(newClickValue);
}, [manualCursor, totalCPS]);

  const purchaseBuilding = (index) => {
    const newBuildings = [...buildings];
    const building = newBuildings[index];

    console.log("Index:", index);
    console.log("Building:", building);  // Check the building object


    if (cookies >= building.cost) {
      const currentCost = building.cost;
      setCookies(prev => prev - currentCost);
      building.number += 1;

      const alpha = 1.15;
      building.cost = Math.round(building.baseCost * Math.pow(alpha, building.number));

      setBuildings(newBuildings);

      const newTotalCPS = newBuildings.reduce((total, item) => total + (item.cps * item.number), 0);
      setTotalCPS(newTotalCPS);
    }
  };


  const purchaseBuildingUpgrade = (upgrade) => {
    // Calculate upgrade cost considering previous purchases
    const upgradeCost = upgrade.baseCost * Math.pow(1.2, upgrade.purchasedAt.length);

    if (cookies >= upgradeCost) {
        // Deduct the cookies for the upgrade
        setCookies(cookies - upgradeCost);

        // Add the upgrade to the purchased list
        const updatedUpgrade = { ...upgrade, purchasedAt: [...upgrade.purchasedAt, Date.now()] };
        const updatedUpgrades = buildingUpgrades.map((up) =>
            up.name === upgrade.name ? updatedUpgrade : up
        );

        // Update the state of upgrades
        setBuildingUpgrades(updatedUpgrades);

        // Apply the effect based on the upgrade type
        if (upgrade.type === 1) {
            // Type 1: Apply a CPS multiplier to a specific building (e.g., cursor)
            const updatedBuildings = buildings.map((building) => {
                if (building.name === upgrade.building) {
                    return {
                        ...building,
                        cps: building.cps * upgrade.multiplier, // Apply the multiplier directly for Type 1
                    };
                }
                return building;
            });
            setBuildings(updatedBuildings);
        }

        if (upgrade.type === 2) {
          // Type 2: Do nothing
         
      }
    }
    
};



  // Auto-clicking cookies per second
  useEffect(() => {
    let interval;

    if (totalCPS > 0) {
      const intervalTime = 20;
      const cookiesPerInterval = totalCPS / (1000/intervalTime); // 50 times per second

      interval = setInterval(() => {
        setCookieOverflow(prevOverflow => {
          const newOverflow = prevOverflow + cookiesPerInterval;
          const fullCookies = Math.floor(newOverflow);
          const fractionalOverflow = newOverflow - fullCookies;

          setCookies(prev => prev + fullCookies);

          return fractionalOverflow;
        });
      }, intervalTime);
    }

    return () => clearInterval(interval);
  }, [totalCPS]);

  // Update building upgrades when a building is purchased
  useEffect(() => {
    console.log("Buildings state in upgrades effect:", buildings);
  
    const updatedUpgrades = buildingUpgrades.map((upgrade) => {
      const building = buildings.find(b => b.name === upgrade.building);
      
  
      // Update to use buildingCount directly
    if (building  && building.number >= upgrade.buildingCount && upgrade.unlockedAt === null) {
      return { ...upgrade, unlockedAt: true }; // Unlock upgrade
    }
    return upgrade; // Otherwise, return the upgrade as is
  });

  setBuildingUpgrades(updatedUpgrades);
}, [buildings]); // Runs whenever buildings change

  const updateTotalCPS = () => {
    const newTotalCPS = buildings.reduce((total, building) => total + (building.cps * building.number), 0);
    setTotalCPS(newTotalCPS);
  };
  
  // Call this whenever buildings or upgrades change
  useEffect(() => {
    updateTotalCPS();
  }, [buildings]); // Runs whenever buildings change


 

  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <div className="left-section">
          <div className='cookie-container'>
            <div className='text-container'>
          <p className="cookie-count">{formatNumber(Math.floor(cookies))} Cookies</p>
          <p className="total-cps">per second: {formatNumber(totalCPS)} click value : {clickValue}</p>
          </div>
          <button onClick={handleClick} className="cookie-button">
            <img src={cookieImage} alt="Cookie" />
          </button>
          </div>
          
        </div>


        {/* Divider */}
        <div className="divider"></div>

        <div className="right-section">
        <p>Upgrades</p>
        <div className="upgrades-section">
          {buildingUpgrades.map((upgrade, index) => {
            // Find the building corresponding to the upgrade
            const building = buildings.find((b) => b.name === upgrade.building);

            // Check if the upgrade can be purchased based on building count
            const canPurchase = building && building.number >= upgrade.buildingCount;

            // Upgrade should only be shown if it meets building count and has not been purchased yet
            if (canPurchase && !upgrade.purchasedAt.length) {
              return (
                <Upgrade
                  key={upgrade.name}
                  index={index}
                  upgrade={upgrade}
                  cookies={cookies}
                  purchaseBuildingUpgrade={purchaseBuildingUpgrade}
                  setCookies={setCookies}
                  buildings={buildings}
                  setBuildings={setBuildings}
                  setTotalCPS={setTotalCPS}
                  formatNumber={formatNumber}
                  icon={upgrade.icon}
                />
              );
            }
            return null; // Don't show the upgrade if it cannot be purchased
          })}
        </div>
        
        <p>Buildings</p>
        <div className='buildings-section'>
          {buildings.map((building, index) => (
          <Building
            index={index}
            building={building}
            cookies={cookies}
            purchaseBuilding={purchaseBuilding}
            hoveredUpgrade={hoveredUpgrade}
            setHoveredUpgrade={setHoveredUpgrade}
            totalCPS={totalCPS}
            formatNumber={formatNumber}
          />
        ))}
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;