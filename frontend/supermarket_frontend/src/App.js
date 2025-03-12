import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Shop from './components/Shop';
import Products from './components/Products';
import Categories from './components/Categories';
import ProductsInStore from './components/ProductsInStore';

function App() {
  return (
    <Router>
      <div style={{ marginLeft: '270px', padding: '20px' }}>
        <Navigation />
        <Routes> { }
          <Route path="/dashboard" /> { }
          <Route path="/shop" element={<Shop />} /> { }
          <Route path="/shop/products" element={<Products />} />
          <Route path="/shop/categories" element={<Categories />} />
          <Route path="/shop/products-in-store" element={<ProductsInStore />} />
        </Routes> { }
      </div>
    </Router>
  );
}

export default App;
