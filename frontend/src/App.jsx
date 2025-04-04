import React , { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Shop from './components/Shop';
import Products from './components/Products';
import Categories from './components/Categories';
import ProductsInStore from './components/ProductsInStore';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CustomersCard from './components/CustomersCard';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <Navigation />
          <div style={{ marginLeft: '270px', padding: '15px' }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/products" element={<Products />} />
              <Route path="/shop/categories" element={<Categories />} />
              <Route path="/shop/products-in-store" element={<ProductsInStore />} />
              <Route path="/shop/customers-card" element={<CustomersCard />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;
