import React, { useState } from 'react';
import './AccountDropdown.css';

function AccountDropdown() {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="account-dropdown">
      <button className="account-button" onClick={toggleDropdown}>
        Account ▾
      </button>

      {open && (
        <div className="dropdown-menu">
          <button className="dropdown-item">My Account</button>
          <button className="dropdown-item">Edit Account</button>
        </div>
      )}
    </div>
  );
}

export default AccountDropdown;
