// components/Header.js
import React from 'react';
import cookieImage from '../images/cookie.png'; // Update path if needed


function Header() {
    return (
      <div className='header-bar'>
        <h1>Cookie Clicker <img src={cookieImage} alt="Cookie" className="cookie-icon" /></h1>
      </div>
    );
  }
  
  export default Header;