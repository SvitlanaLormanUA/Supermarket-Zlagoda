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
                <div className="sections">
                    <button className="shop-section">
                        <img src="/assets/images/products.png" alt="Shop" className="button-icon" />
                        Products
                    </button>

                    <button className="shop-section">
                        <img src="/assets/images/categoriesColor.png" alt="Categories" className="button-icon" />
                        Categories
                    </button>

                    <button className="shop-section">
                        <img src="/assets/images/store.png" alt="ProductsInStore" className="button-icon" />
                        Products in Store
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Shop;
