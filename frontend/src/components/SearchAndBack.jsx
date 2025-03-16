import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchAndBack() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="search-back-container">
            {/* BackButton */}
            <button onClick={handleBackClick} className="back-button">
                <img src="/assets/images/back.png" alt="Back" className="back-icon" />
            </button>

            {/* Search */}
            <div className="shop-search-bar">
                <input type="text" placeholder="Search..." className="search-input" />
                <img src="/assets/images/search.png" alt="Search" className="search-icon" />
            </div>
        </div>
    );
}

export default SearchAndBack;
