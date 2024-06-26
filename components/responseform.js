"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const ResponseForm = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [formData, setFormData] = useState({
    feedback_id: '',
    responses: [],
  });
  const [submittedResponses, setSubmittedResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const [password, setPassword] = useState('');
  const router =useRouter()
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/fetchFeedback');
        setFeedbackData(response.data);
      } catch (error) {
        setError('Error fetching feedback data');
        toast.error('Error fetching feedback data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSelectFeedback = (feedbackId) => {
    setIsPasswordVerified(false)
    const feedback = feedbackData.find((feedback) => feedback._id === feedbackId);
    if (feedback) {
      setSelectedFeedback(feedback);
      setCurrentSubjectIndex(0);
      setFormData({
        feedback_id: feedbackId,
        responses: feedback.subjects.map((subject) => ({
          subject_id: subject._id,
          ratings: [],
          suggestions: '',
        })),
      });
    }
  };

  const handleNextSubject = (e) => {
    e.preventDefault();
    const currentResponses = formData.responses[currentSubjectIndex];
    const hasEmptyRating = currentResponses.ratings.some(rating => !rating);
    if (!hasEmptyRating) {
      if (currentSubjectIndex < selectedFeedback.subjects.length - 1) {
        setCurrentSubjectIndex((prevIndex) => prevIndex + 1);
      } else {
        handleSubmit(e);
      }
    } else {
      setError('Please rate all questions before proceeding');
    }
  };

  const handleRatingChange = (subjectIndex, questionIndex, rating) => {
    setFormData((prevFormData) => {
      const updatedResponses = [...prevFormData.responses];
      const updatedRatings = [...updatedResponses[subjectIndex].ratings];
      updatedRatings[questionIndex] = rating;
      updatedResponses[subjectIndex] = {
        ...updatedResponses[subjectIndex],
        ratings: updatedRatings,
      };
      return {
        ...prevFormData,
        responses: updatedResponses,
      };
    });
  };


  const handleSuggestionsChange = (subjectIndex, suggestions) => {
    setFormData((prevFormData) => {
      const updatedResponses = [...prevFormData.responses];
      updatedResponses[subjectIndex] = {
        ...updatedResponses[subjectIndex],
        suggestions,
      };
      return {
        ...prevFormData,
        responses: updatedResponses,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/response', {
        feedback_id: formData.feedback_id,
        responses: formData.responses,

      });
      setSubmittedResponses([...submittedResponses, response.data]);

      toast.success("Feedback submitted successfully")
      router.replace("/")
      setFormData({
        feedback_id: '',
        responses: [],
      });
      setCurrentSubjectIndex(0);

    } catch (error) {
      setError('Failed to submit response. Please try again.');
      toast.error('Failed to submit response. Please try again.');
    }
  };
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      console.log(password);
      console.log(selectedFeedback);
      if (selectedFeedback.pwd === e.target.password.value) {
        setIsPasswordVerified(true);
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      setError('Error verifying password');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full px-4 py-8 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Submit Response</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="feedbackSelect" className="block mb-2 text-gray-700">
                Select Feedback:
              </label>
              <select
                id="feedbackSelect"
                name="feedback_id"
                value={formData.feedback_id}
                onChange={(e) => handleSelectFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Feedback</option>
                {feedbackData.map((feedback) => (
                  <option key={feedback._id} value={feedback._id}>
                    {feedback.feedbackTitle}
                  </option>
                ))}
              </select>
            </div>
            {selectedFeedback && !isPasswordVerified && (
              <div className="mb-4">
                <form onSubmit={handleSubmitPassword} className="bg-white p-8 rounded-md shadow-md">
                  <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 text-gray-700">
                      Enter Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Allow user to type password
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  >
                    Submit Password
                  </Button>
                </form>
              </div>
            )}
            {selectedFeedback && isPasswordVerified && (

              <div className="mb-4">
                <form onSubmit={handleNextSubject} className="bg-white p-8 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {selectedFeedback.subjects[currentSubjectIndex].subject}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Faculty: {selectedFeedback.subjects[currentSubjectIndex].faculty}
                  </p>
                  {selectedFeedback.questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-4">
                      <label className="block mb-2 text-gray-700">{question}</label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <React.Fragment key={rating}>
                            <input
                              type="radio"
                              id={`${currentSubjectIndex}-${qIndex}-${rating}`}
                              name={`${currentSubjectIndex}-${qIndex}`}
                              value={rating}
                              checked={formData.responses[currentSubjectIndex]?.ratings[qIndex] === rating}
                              onChange={() => handleRatingChange(currentSubjectIndex, qIndex, rating)}
                              className="mr-2"
                              required
                            />
                            <label htmlFor={`${currentSubjectIndex}-${qIndex}-${rating}`} className="mr-4 text-gray-700">
                              {rating}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mb-4">
                    <label htmlFor="suggestions" className="block mb-2">
                      Suggestions:
                    </label>
                    <textarea
                      id="suggestions"
                      name="suggestions"
                      value={formData.responses[currentSubjectIndex]?.suggestions || ''}
                      onChange={(e) => handleSuggestionsChange(currentSubjectIndex, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  >
                    {currentSubjectIndex === selectedFeedback.subjects.length - 1 ? 'Submit Response' : 'Next Subject'}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ResponseForm;
