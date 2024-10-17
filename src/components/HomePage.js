import React from 'react';
import { Link } from 'react-router-dom';
//import FeedbackForm from '../components/FeedbackForm';

const HomePage = () => (
  <div>
    <h1>Welcome to Geolocation App</h1>
    <Link to="/map">Go to Map</Link>
    {/* <FeedbackForm /> */}
  </div>
);

export default HomePage;
