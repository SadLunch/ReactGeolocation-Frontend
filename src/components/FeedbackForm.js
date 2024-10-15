import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('https://reactgeolocation-backend.onrender.com'); // Replace with your backend URL

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  // State to track whether feedback is submitted
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    socket.emit('feedback', feedback);
    setSubmitted(true);
  };

  return (
    <div>
      {submitted ? (
        // Show the "Feedback submitted" message if the form has been submitted
        <div className="feedback-message">
          <p>Thanks for your feedback!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          name="feedback"
          method="POST"
          data-netlify="true"
        >
          <input type="hidden" name="form-name" value="feedback" />
          <p>How was your experience?</p>
          <div className="feedback-options">
            <label>
              <input
                type="radio"
                name="feedback"
                value="good"
                onChange={(e) => setFeedback(e.target.value)}
              />
              😊 Good
            </label>
            <label>
              <input
                type="radio"
                name="feedback"
                value="okay"
                onChange={(e) => setFeedback(e.target.value)}
              />
              😐 Okay
            </label>
            <label>
              <input
                type="radio"
                name="feedback"
                value="bad"
                onChange={(e) => setFeedback(e.target.value)}
              />
              😟 Bad
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )
      }
    </div>

  );
};

export default FeedbackForm;
