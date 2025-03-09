import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div style={{ marginLeft: '250px', padding: '20px' }}>
        <Navigation />
        <Routes> {}
          <Route path="/" element={<h1>Welcome to supermarket!</h1>} /> {}
        </Routes> {}
      </div>
    </Router>
  );
}

export default App;
