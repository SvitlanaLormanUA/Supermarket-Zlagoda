import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li><Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button className="dashboard-button">
            <img src="/assets/images/dashboard.png" alt="Dashboard" className="button-icon" />
            Dashboard
          </button></Link>
        </li>

        <li><Link to="/shop" style={{ textDecoration: 'none' }}>
          <button className="shop-button">
            <img src="/assets/images/shop.png" alt="Shop" className="button-icon" />
            Shop
          </button></Link>
        </li>

        <li><Link to="/employees" style={{ textDecoration: 'none' }}>
          <button className="shop-button">
            <img src="/assets/images/workers.png" alt="Employees" className="button-icon" />
            Employees
          </button></Link>
        </li>

        <li className="dropdown">
          <button className="account-button" onClick={toggleDropdown}>
            <img src="/assets/images/account.png" alt="Account" className="button-icon" />
            Account ▾
          </button>

          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/my-account">My Account</Link></li>
              <li><Link to="/edit-account">Edit Account</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
