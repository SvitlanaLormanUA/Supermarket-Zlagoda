import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navigation from './components/Navigation';
import Shop from './components/Shop';
import Products from './components/Products';
import Categories from './components/Categories';
import ProductsInStore from './components/ProductsInStore';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CustomersCard from './components/CustomersCard';
import Receipts from './components/Receipts';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const role = Cookies.get('user_role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_role');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Navigation onLogout={handleLogout} userRole={userRole} />
          <div style={{ marginLeft: '270px', padding: '15px' }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/shop"
                element={userRole === 'Manager' ? <Shop /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/shop/products"
                element={userRole === 'Manager' ? <Products /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/shop/categories"
                element={userRole === 'Manager' ? <Categories /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/shop/products-in-store"
                element={userRole === 'Manager' ? <ProductsInStore /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/shop/customers-card"
                element={userRole === 'Manager' ? <CustomersCard /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/shop/receipts"
                element={userRole === 'Manager' ? <Receipts /> : <Navigate to="/dashboard" />}
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;