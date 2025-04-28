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
import Profile from './components/Profile';
import Employees from './components/Employees';
import ReportsPage from './components/ReportsPage';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // у секундах
    return decoded.exp < currentTime;
  } catch (InvalidTokenError) {
    return true;
  }
};
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const role = Cookies.get('user_role');
    if (token && role) {
      if (isTokenExpired(token)) {
        handleLogout();
      } else {
        setIsLoggedIn(true);
        setUserRole(role);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
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
        {isLoggedIn &&
          <Navigation onLogout={handleLogout} userRole={userRole} />
        }
          <div style={{ marginLeft: '270px', padding: '15px' }}>
            <Routes>
            <Route path="/login" element={ <Login onLogin={handleLogin} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/employees"
                element={<Employees />}
              />
              <Route
                path="/shop"
                element={<Shop userRole={userRole} />}
              />
              <Route
                path="/shop/products"
                element={userRole === 'Manager' ? <Products /> : <Navigate to="/dashboard" />}
              />
                <Route
                path="/shop/reports"
                element={userRole === 'Manager' ? <ReportsPage /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/shop/categories"
                element={<Categories />}
              />
              <Route
                path="/shop/products-in-store"
                element={<ProductsInStore />}
              />
              <Route
                path="/shop/customers-card"
                element={<CustomersCard />}
              />
              <Route
                path="/shop/receipts"
                element={<Receipts />}
              />
              <Route 
                path="/profile"
                element={<Profile onLogout = {handleLogout}/>}
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