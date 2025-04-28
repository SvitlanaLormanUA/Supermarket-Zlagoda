import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios'; 
import SearchAndBack from './SearchAndBack';

function Shop({ userRole }) {
  const [totalPrice, setTotalPrice] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const priceResponse = await api.get('/products-in-store/total_price');
        const priceData = priceResponse.data.data ?? JSON.parse(priceResponse.data.body);
        setTotalPrice(priceData.total_price);

        const quantityResponse = await api.get('/products-in-store/total_quantity');
        const quantityData = quantityResponse.data.data ?? JSON.parse(quantityResponse.data.body);
        setTotalQuantity(quantityData.total_quantity);
      } catch (error) {
        console.error('Error fetching shop stats:', error);
        setError(error.response?.data?.detail || 'Failed to load shop statistics.');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="shop-container">
      <SearchAndBack />

      { userRole === 'Manager' &&
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
    }
      <div className="shop-sections">
        <div className="sections">
          <Link to="/shop/products-in-store" style={{ textDecoration: 'none' }}>
            <button className="shop-section">
              <img src="/assets/images/store.png" alt="ProductsInStore" className="button-icon" />
              Products in Store
            </button>
          </Link>

        { userRole === 'Manager' &&
          <Link to="/shop/products" style={{ textDecoration: 'none' }}>
            <button className="shop-section">
              <img src="/assets/images/products.png" alt="Shop" className="button-icon" />
              Products
            </button>
          </Link>
      }

          <Link to="/shop/categories" style={{ textDecoration: 'none' }}>
            <button className="shop-section">
              <img src="/assets/images/categoriesColor.png" alt="Categories" className="button-icon" />
              Categories
            </button>
          </Link>

          <Link to="/shop/receipts" style={{ textDecoration: 'none' }}>
            <button className="shop-section">
              <img src="/assets/images/receipt.png" alt="Receipt" className="button-icon" />
              Receipts
            </button>
          </Link>

          <Link to="/shop/customers-card" style={{ textDecoration: 'none' }}>
            <button className="shop-section">
              <img src="/assets/images/gift-card.png" alt="Customers' Cards" className="button-icon" />
              Customers' Cards
            </button>
          </Link>

          { userRole === 'Manager' &&
          <Link to="/shop/reports" style={{ textDecoration: 'none' }}>
            <button className="shop-section">
              <img src="/assets/images/report.png" alt="Report" className="button-icon" />
              Report
            </button>
          </Link>
        }
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