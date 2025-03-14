import React from 'react';
import { Link } from 'react-router-dom';

function Shop() {
    return (
        <div className="shop-container">
            <div className="shop-search-bar">
                <input type="text" placeholder="Search..." className="search-input" />
                <img src="/assets/images/search.png" alt="Search" className="search-icon" />
            </div>

            <div className="shop-sections">
                <div className="sections">
                    <Link to="/shop/products" style={{ textDecoration: 'none' }}>
                        <button className="shop-section">
                            <img src="/assets/images/products.png" alt="Shop" className="button-icon" />
                            Products
                        </button>
                    </Link>

                    <Link to="/shop/categories" style={{ textDecoration: 'none' }}>
                        <button className="shop-section">
                            <img src="/assets/images/categoriesColor.png" alt="Categories" className="button-icon" />
                            Categories
                        </button>
                    </Link>

                    <Link to="/shop/products-in-store" style={{ textDecoration: 'none' }}>
                        <button className="shop-section">
                            <img src="/assets/images/store.png" alt="ProductsInStore" className="button-icon" />
                            Products in Store
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Shop;
