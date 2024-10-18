import React, { useState, useEffect } from 'react';
import './App.css';
import './Button.css';
import './Layout.css';
import cookieImage from './images/cookie.png';

function Footer() {
  return <div className='footer'>© 2024 Preto's Games</div>;
}

function Header() {
  return (
    <div className='header-bar'>
      <h1>Cookie Clicker <img src={cookieImage} alt="Cookie" className="cookie-icon" /></h1>
    </div>
  );
}

function App() {
  const [cookies, setCookies] = useState(0);
  const [clickValue, setClickValue] = useState(1); // Value of each manual click
  const [totalCPS, setTotalCPS] = useState(0); // Total CPS (sum of all upgrades)
  const [cookieOverflow, setCookieOverflow] = useState(0); // Accumulates fractional cookies
  const [hoveredUpgrade, setHoveredUpgrade] = useState(null); // Track hovered upgrade index

  const scales = [
    { value: 1e6, label: 'million' }, // Million
    { value: 1e9, label: 'billion' }, // Billion
    { value: 1e12, label: 'trillion' }, // Trillion
    { value: 1e15, label: 'quadrillion' }, // Quadrillion
    { value: 1e18, label: 'quintillion' }, // Quintillion
  ];

  const formatNumber = (num) => {
    if (num < 1000) {
      return num.toLocaleString(); // No scaling needed for numbers less than 1000
    }

    for (let i = scales.length - 1; i >= 0; i--) {
      if (num >= scales[i].value) {
        const formattedNum = (num / scales[i].value).toFixed(3); // Format to 3 decimals
        return `${formattedNum} ${scales[i].label}`;
      }
    }

    return num.toLocaleString(); // If number is too large, return as is
  };

  const [upgrades, setUpgrades] = useState([
    { name: 'Cursor', baseCost: 15, cps: 0.1, number: 0, cost: 15, description: 'Autoclicks to generate more cookies' },
    { name: 'Grandma', baseCost: 100, cps: 1, number: 0, cost: 100,description: 'A nice grandma to bake more cookies' },
    { name: 'Farm', baseCost: 1100, cps: 8, number: 0, cost: 1100, description: 'Grows cookie plants from cookie seeds' },
    { name: 'Mine', baseCost: 12000, cps: 47, number: 0, cost: 12000, description: 'Mines out cookie dough and chocolate chips.' },
    { name: 'Factory', baseCost: 130000, cps: 260, number: 0, cost: 130000, description: 'Produces large quantities of cookies.' },
    { name: 'Bank', baseCost: 1400000, cps: 1400, number: 0, cost: 1400000, description: 'Generates cookies from interest.' },
  ]);

  const handleClick = () => {
    setCookies(prev => prev + clickValue);
  };

  const purchaseUpgrade = (index) => {
    const newUpgrades = [...upgrades];
    const upgrade = newUpgrades[index];

    if (cookies >= upgrade.cost) {
      const currentCost = upgrade.cost;
      setCookies(prev => prev - currentCost);
      upgrade.number += 1;

      const alpha = 1.15;
      upgrade.cost = Math.round(upgrade.baseCost * Math.pow(alpha, upgrade.number));

      setUpgrades(newUpgrades);

      const newTotalCPS = newUpgrades.reduce((total, item) => total + (item.cps * item.number), 0);
      setTotalCPS(newTotalCPS);
    }
  };

  useEffect(() => {
    let interval;

    if (totalCPS > 0) {
      const intervalTime = 20;
      const cookiesPerInterval = totalCPS / 50;

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


  // PAGE
  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header />

      <div className="content-wrapper">
        <div className="left-section">
          <p className="cookie-count">{formatNumber(Math.floor(cookies))} Cookies
          </p>

          <div className="cookie-strip"></div>

          <p className='total-cps'>
            por segundo: {formatNumber(totalCPS)}
            </p>
            
          {/* Manual Click Button */}
          <button onClick={handleClick} className="cookie-button">
            <img src={cookieImage} alt="Cookie" />
          </button>
        </div>

        <div className="divider"></div>  {/* Divider element */}

        {/* Right Section Upgrade Buttons */}
<div className="right-section">
  <h3>Buildings</h3>
  {upgrades.map((upgrade, index) => (
    <button
      key={index}
      onClick={() => purchaseUpgrade(index)}
      onMouseEnter={() => setHoveredUpgrade(index)} // Set hovered index
      onMouseLeave={() => setHoveredUpgrade(null)} // Remove hovered index
      disabled={cookies < upgrade.cost}
      className="upgrade-item"
    >
        <div className="upgrade-number">
        {formatNumber(upgrade.number)} {/* Display the upgrade number */}
      </div>
      <div className="upgrade-details">
        <p className="upgrade-name">{upgrade.name}</p>
        <p className="upgrade-description">{upgrade.description}</p> {/* Display the description */}

         {/* Tooltip showing CPS when hovered */}
         {hoveredUpgrade === index && (
                  <div className="tooltip">
                    CPS: {formatNumber(upgrade.cps * upgrade.number)}
                    </div>
                )}
      </div>
      <div className="upgrade-cost">
        {formatNumber(upgrade.cost)} <img src={cookieImage} alt="Cookie" className="cookie-icon" />
      </div>
    </button>
  ))}
</div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
