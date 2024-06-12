import { useState } from 'react';
import axios from 'axios';
const Evaluation = () => {
  const [formData, setFormData] = useState({
    feedbackId: '',
    facultyName: '',
  });
  const [feedbackData, setFeedbackData] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await axios.post('/api/feedback', formData);
      const data = await response.json();
      setFeedbackData(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  return (
    <div>
      <h1>Evaluation Feedback Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="feedbackId">Feedback Id:</label>
          <input
            type="text"
            id="feedbackId"
            name="feedbackId"
            value={formData.feedbackId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="facultyName">Faculty Name:</label>
          <input
            type="text"
            id="facultyName"
            name="facultyName"
            value={formData.facultyName}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Show Feedback</button>
      </form>

      {feedbackData && (
        <div>
          {feedbackData && (
            <div>
              <h2>Feedback Id: {feedbackData.feedbackId}</h2>
              <h3>{feedbackData.class} {feedbackData.feedbackType}</h3>
              <h4>Subtopic: {feedbackData.subject}</h4>
              <h4>Faculty Name: {feedbackData.facultyName}</h4>
              <p>{feedbackData.institution}</p>
              <p>Date of Feedback: {feedbackData.date}</p>
              <p>Total Feedbacks: {feedbackData.totalFeedbacks}</p>

              <table border="1">
                <thead>
                  <tr>
                    <th>Que No</th>
                    <th>Question</th>
                    <th>Poor</th>
                    <th>Average</th>
                    <th>Good</th>
                    <th>Very Good</th>
                    <th>Excellent</th>
                    <th>Evaluation Point</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackData.questions.map((question, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{question.text}</td>
                      <td>{question.responses.poor}</td>
                      <td>{question.responses.average}</td>
                      <td>{question.responses.good}</td>
                      <td>{question.responses.veryGood}</td>
                      <td>{question.responses.excellent}</td>
                      <td>{question.evaluationPoint}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7">Total</td>
                    <td>{feedbackData.totalEvaluationPoints}</td>
                  </tr>
                  <tr>
                    <td colSpan="7">Average</td>
                    <td>{feedbackData.average}</td>
                  </tr>
                </tfoot>
              </table>

              <h4>Suggestions</h4>
              <p>{feedbackData.suggestions}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Evaluation;
