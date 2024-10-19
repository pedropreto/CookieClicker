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


function App() {
  const [cookies, setCookies] = useState(0);
  const [clickValue, setClickValue] = useState(1); // Value of each manual click
  const [totalCPS, setTotalCPS] = useState(0); // Total CPS (sum of all upgrades)
  const [cookieOverflow, setCookieOverflow] = useState(0); // Accumulates fractional cookies
  const [hoveredUpgrade, setHoveredUpgrade] = useState(null); // Track hovered upgrade index



  const [buildings, setBuildings] = useState([
    { name: 'Cursor', baseCost: 15, cps: 0.1, number: 0, cost: 15, description: 'Autoclicks to generate more cookies', cpsMultiplier: 1 },
    { name: 'Grandma', baseCost: 100, cps: 1, number: 0, cost: 100,description: 'A nice grandma to bake more cookies', cpsMultiplier: 1 },
    { name: 'Farm', baseCost: 1100, cps: 8, number: 0, cost: 1100, description: 'Grows cookie plants from cookie seeds', cpsMultiplier: 1 },
    { name: 'Mine', baseCost: 12000, cps: 47, number: 0, cost: 12000, description: 'Mines out cookie dough and chocolate chips.', cpsMultiplier: 1 },
    { name: 'Factory', baseCost: 130000, cps: 260, number: 0, cost: 130000, description: 'Produces large quantities of cookies.', cpsMultiplier: 1 },
    { name: 'Bank', baseCost: 1400000, cps: 1400, number: 0, cost: 1400000, description: 'Generates cookies from interest.', cpsMultiplier: 1 },
  ]);

  const [buildingUpgrades, setBuildingUpgrades] = useState([
    { name: 'Cursor', building: 'Cursor', thresholds: [1, 5, 15, 25, 50, 100], unlockedAt: null, purchasedAt: [], baseCost: 100, cpsMultiplier: 2 },
    { name: 'Grandma', building: 'Grandma', thresholds: [1, 5, 15, 25, 50, 100], unlockedAt: null, purchasedAt: [], baseCost: 500, cpsMultiplier: 2 },
    { name: 'Farm', building: 'Farm', thresholds: [1, 5, 15, 25, 50, 100], unlockedAt: null, purchasedAt: [], baseCost: 5000, cpsMultiplier: 2 },
    // Add other building upgrades similarly...
  ]);

  // when you click manually on the element (cookie)
  const handleClick = () => {
    setCookies(prev => prev + clickValue);
  };


  const purchaseBuilding = (index) => {
    const newBuildings = [...buildings];
    const building = newBuildings[index];


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


  const purchaseBuildingUpgrade = (index) => {
    const newUpgrades = [...buildingUpgrades];
    const upgrade = newUpgrades[index];
    const upgradeCost = upgrade.baseCost * Math.pow(2, upgrade.purchasedAt.length);
  
    if (cookies >= upgradeCost) {
      // Deduct the cost from cookies
      setCookies(prev => prev - upgradeCost);
  
      // Mark this upgrade as purchased
      upgrade.purchasedAt.push(upgradeCost);
  
      // Apply the upgrade multiplier (optional, depending on game logic)
      const newBuildings = [...buildings];
      const building = newBuildings.find(b => b.name === upgrade.building);
      building.cps *= upgrade.cpsMultiplier; // Update CPS of the related building
  
      setBuildings(newBuildings);
      setBuildingUpgrades(newUpgrades);
  
      // Recalculate total CPS after applying the upgrade
      const newTotalCPS = newBuildings.reduce((total, item) => total + (item.cps * item.number), 0);
      setTotalCPS(newTotalCPS);
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
    const updatedUpgrades = buildingUpgrades.map((upgrade) => {
      const building = buildings.find(b => b.name === upgrade.building);


      // Find the next threshold to unlock
      const nextThreshold = upgrade.thresholds.find(threshold => building.number >= threshold && !upgrade.purchasedAt.includes(threshold));

      if (nextThreshold && upgrade.unlockedAt !== nextThreshold) {
        return { ...upgrade, unlockedAt: nextThreshold }; // Unlock upgrade
      }
      return upgrade;
    });

    setBuildingUpgrades(updatedUpgrades);
  }, [buildings]); // Effect runs whenever buildings state is updated


  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <div className="left-section">
          <p className="cookie-count">{formatNumber(Math.floor(cookies))} Cookies</p>
          <button onClick={handleClick} className="cookie-button">
            <img src={cookieImage} alt="Cookie" />
          </button>
          <p className="total-cps">per second: {formatNumber(totalCPS)}</p>
        </div>
        <div className="right-section">
        {buildingUpgrades.map((upgrade, index) => (
          <Upgrade
            upgrade={upgrade}
            cookies={cookies}
            purchaseBuildingUpgrade={purchaseBuildingUpgrade}
            setCookies={setCookies}
            buildings={buildings}
            setBuildings={setBuildings}
            setTotalCPS={setTotalCPS}
            formatNumber={formatNumber}
          />
        ))}
          {buildings.map((building, index) => (
          <Building
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
      <Footer />
    </div>
  );
}

export default App;