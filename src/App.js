import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapPage from './components/MapPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
