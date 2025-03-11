import React from 'react';
import './Shop.css';

function Shop() {
    return (
        <div className="shop-container">
            <div className="shop-search-bar">
                <input type="text" placeholder="Search..." className="search-input" />
                <img src="/assets/images/search.png" alt="Search" className="search-icon" />
            </div>

            <div className="shop-sections">
                <div className="shop-section"></div>
                <div className="shop-section"></div>
                <div className="shop-section"></div>
            </div>
        </div>
    );
}

export default Shop;
