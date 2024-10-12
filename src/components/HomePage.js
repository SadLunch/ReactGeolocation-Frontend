import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div>
    <h1>Welcome to Geolocation App</h1>
    <Link to="/map">Go to Map</Link>
  </div>
);

export default HomePage;
