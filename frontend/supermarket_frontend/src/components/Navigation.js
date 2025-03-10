import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">
          <button className="dashboard-button">
            <img src="/assets/images/dashboard.png" alt="Dashboard" className="button-icon" />
            Dashboard
          </button></Link>
        </li>

        <li><Link to="/add-product"><button className="add-button">
          <img src="/assets/images/addProduct.png" alt="AddProduct" className="button-icon" />
          Add Product
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
