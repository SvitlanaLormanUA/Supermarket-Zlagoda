import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchAndBack({ onSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBackClick = () => {
    navigate('/shop');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
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
          onKeyDown={handleKeyDown}
        />
        <img
          src="/assets/images/search.png"
          alt="Search"
          className="search-icon"
          onClick={handleSearchClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}

export default SearchAndBack;
