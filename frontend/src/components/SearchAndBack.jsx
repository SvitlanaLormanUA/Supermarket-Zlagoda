import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchAndBack({ onSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-back-container">
      <button onClick={handleBackClick} className="back-button">
        <img src="/assets/images/back.png" alt="Back" className="back-icon" />
      </button>

      <div className="shop-search-bar">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <img src="/assets/images/search.png" alt="Search" className="search-icon" />
      </div>
    </div>
  );
}

export default SearchAndBack;
