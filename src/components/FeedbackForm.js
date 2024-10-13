import React, { useState } from 'react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You don't need a special submit action, Netlify handles the form submission.
    alert('Feedback submitted!');
  };

  return (
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
  );
};

export default FeedbackForm;
