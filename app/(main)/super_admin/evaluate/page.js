"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
const EvaluationPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponses] = useState([]);
  const printDiv = () => {
    const printContents = document.getElementById('table-to-print').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    return dd +"/"+ mm+"/" + yyyy;
  };
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get('/api/feedback');
        setFeedbackData(response.data.feedbacks);
        console.log(feedbacks);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbackData();
  }, []);

  useEffect(() => {
    if (selectedFeedback) {
      setSelectedFeedbackId(selectedFeedback._id)
      const fetchFeedbackResponses = async () => {
        try {
          const response = await axios.get(`/api/response?feedbackId=${selectedFeedbackId}`);
          setResponses(response.data);
        } catch (error) {
          console.error('Error fetching responses:', error);
          setResponses([]);
        }
      };

      fetchFeedbackResponses();
    }

  }, [selectedFeedback, selectedSubject, selectedFeedbackId]);

  const calculateEvaluationPoint = (questionIndex) => {
    let totalPoints = 0;
    let totalRatings = 0;

    response.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === selectedSubject._id);
      if (ratingsForSubject) {
        const rating = ratingsForSubject.ratings[questionIndex];
        if (!isNaN(rating) && rating !== null) {
          totalPoints += rating;
          totalRatings++;
        }
      }
    });

    return totalRatings > 0 ? totalPoints / totalRatings : 0;
  };

  const calculateRatingCounts = (questionIndex) => {
    const ratingCounts = { Poor: 0, Average: 0, Good: 0, VeryGood: 0, Excellent: 0 };

    response.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === selectedSubject._id);
      if (ratingsForSubject) {
        const rating = ratingsForSubject.ratings[questionIndex];
        if (!isNaN(rating) && rating !== null) {
          if (rating === 1) ratingCounts.Poor++;
          else if (rating === 2) ratingCounts.Average++;
          else if (rating === 3) ratingCounts.Good++;
          else if (rating === 4) ratingCounts.VeryGood++;
          else if (rating === 5) ratingCounts.Excellent++;
        }
      }
    });

    return ratingCounts;
  };

  const calculateTotalPoints = () => {
    let total = 0;

    response.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === selectedSubject._id);
      if (ratingsForSubject) {
        ratingsForSubject.ratings.forEach((rating) => {
          if (!isNaN(rating) && rating !== null) {
            total += rating;
          }
        });
      }
    });

    return total;
  };

  const calculateAveragePoints = () => {
    const totalPoints = calculateTotalPoints();
    const totalQuestions = selectedFeedback.questions.length;
    return totalPoints / (response.length * totalQuestions);
  };
   
  return (
    <div>
      <h1>Faculty Evaluation</h1>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Select defaultValue={selectedFeedbackId} onValueChange={(value) => setSelectedFeedback(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue  >Select a Feedback</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {feedbackData && feedbackData.map((feedback) => (
                <SelectItem key={feedback._id} value={feedback}>
                  {feedback.feedbackTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Select defaultValue={selectedSubject} onValueChange={(value) => setSelectedSubject(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Subject" />
            </SelectTrigger>
            <SelectContent>
              {selectedFeedback && selectedFeedback.subjects.map((subject) => (
                <SelectItem key={subject._id} value={subject}>
                  {subject.faculty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {response && response.length > 0 && (
          <div id="table-to-print" className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Feedback Title: {selectedFeedback?.feedbackTitle} Faculty Name: {selectedSubject.faculty} Subject: {selectedSubject.subject}
            </h2>
            <p className="mb-4">Date of Feedback: {formatDate(response[0].date)} Total Feedbacks: {response.length}</p>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Que No</th>
                  <th className="px-4 py-2">Question</th>
                  <th className="px-4 py-2">Poor</th>
                  <th className="px-4 py-2">Average</th>
                  <th className="px-4 py-2">Good</th>
                  <th className="px-4 py-2">Very Good</th>
                  <th className="px-4 py-2">Excellent</th>
                  <th className="px-4 py-2">Evaluation Point</th>
                </tr>
              </thead>
              <tbody>
                {selectedFeedback && selectedFeedback?.questions.map((question, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{question}</td>
                    {Object.values(calculateRatingCounts(index)).map((count, i) => (
                      <td key={i} className="border px-4 py-2">{count}</td>
                    ))}
                    <td className="border px-4 py-2">{calculateEvaluationPoint(index).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="7" className="text-right font-bold pr-4">Total</td>
                  <td className="border px-4 py-2">{calculateTotalPoints()}</td>
                </tr>
                <tr>
                  <td colSpan="7" className="text-right font-bold pr-4">Average</td>
                  <td className="border px-4 py-2">{calculateAveragePoints().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
         <Button onClick={printDiv}>Print</Button>
      </div>
    </div>
  );
};

export default EvaluationPage;
