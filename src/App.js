import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapPage from './components/MapPage';
import HomePage from './components/HomePage';
import ExperiencePage from './components/ExperiencePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
      </Routes>
    </Router>
  );
}

export default App;
