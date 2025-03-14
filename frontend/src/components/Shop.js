import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD:frontend/supermarket_frontend/src/components/Shop.js
import './Shop.css';
import Search from './Search';
=======
>>>>>>> bf2d68ecbca44751cd7d595479512e3b2e798a7b:frontend/src/components/Shop.js

function Shop() {
    return (
        <div className="shop-container">
            <Search />
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
