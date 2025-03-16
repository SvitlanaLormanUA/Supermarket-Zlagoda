import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchAndBack from './SearchAndBack';

function Shop() {
    const [totalPrice, setTotalPrice] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5174/products/total_price')
            .then((res) => res.json())
            .then((data) => {
                const parsedData = JSON.parse(data.body);
                setTotalPrice(parsedData.total_price);
            })
            .catch((error) => console.error('Error fetching data:', error));

        fetch('http://127.0.0.1:5174/products/total_quantity')
            .then((res) => res.json())
            .then((data) => {
                const parsedData = JSON.parse(data.body);
                setTotalQuantity(parsedData.total_quantity);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    return (
        <div className="shop-container">
            <SearchAndBack />

            <div className="shop-stats">
                <div className="shop-stat-card">
                    <div className="shop-stat-title">Total Price of Store Products</div>
                    <div className="shop-stat-value">{totalPrice !== null ? `$${totalPrice}` : 'Loading...'}</div>
                </div>
                <div className="shop-stat-card">
                    <div className="shop-stat-title">Total Quantity of Store Products</div>
                    <div className="shop-stat-value">{totalQuantity !== null ? totalQuantity : 'Loading...'}</div>
                </div>
            </div>

            <div className="shop-sections">
                <div className="sections">
                    <Link to="/shop/products-in-store" style={{ textDecoration: 'none' }}>
                        <button className="shop-section">
                            <img src="/assets/images/store.png" alt="ProductsInStore" className="button-icon" />
                            Products in Store
                        </button>
                    </Link>

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
                </div>
            </div>
            <style jsx>{`
                .back-button {
                    visibility: hidden;
                }
            `}</style>
        </div>
    );
}

export default Shop;
