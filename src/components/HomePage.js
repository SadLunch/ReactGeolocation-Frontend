import React from 'react';
import { Link } from 'react-router-dom';
//import FeedbackForm from '../components/FeedbackForm';

const HomePage = () => (
  <div>
    <h1>Welcome to Geolocation App</h1>
    <Link to="/map">Go to Map</Link>
    <span onClick={() => {
      localStorage.removeItem('uuid');
    }} >Remove User ID from localstorage</span>
    {/* <FeedbackForm /> */}
  </div>
);

export default HomePage;
