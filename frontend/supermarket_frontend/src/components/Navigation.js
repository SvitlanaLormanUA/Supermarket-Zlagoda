import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/add-product">Add Product</Link></li>
        <li><Link to="/login">Account</Link></li>
      </ul>
    </div>
  );
}

export default Navigation;
