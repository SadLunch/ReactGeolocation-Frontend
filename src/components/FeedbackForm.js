import React, { useState } from 'react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const myForm = event.target;
    const formData = new FormData(myForm);
    
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => alert(`Form successfully submitted: ${feedback}`))
      .catch((error) => alert(error));
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
