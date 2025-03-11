import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Shop from './components/Shop';

function App() {
  return (
    <Router>
      <div style={{ marginLeft: '270px', padding: '20px' }}>
        <Navigation />
        <Routes> {}
          <Route path="/dashboard"/> {}
          <Route path="/shop" element={<Shop/>}/> {}
        </Routes> {}
      </div>
    </Router>
  );
}

export default App;
