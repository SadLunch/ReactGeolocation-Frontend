import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import { useLocation } from 'react-router-dom';

const ExperiencePage = () => {
  const location = useLocation();
  const { expName } = location.state || { expName: 'No text provided' };
  <div>
    <h1>{expName}</h1>
    <FeedbackForm />
  </div>
};

export default ExperiencePage;
