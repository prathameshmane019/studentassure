
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context/UserContext';
const EvaluationPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [feedbackMode, setFeedbackMode] = useState('individual');


  const user = useUser();
  

  useEffect(() => {
    if (user) {
      setSelectedDepartment(user.department)
     
    }    
  }, [user]);

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
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  };

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get('/api/feedback');
        const filteredFeedbackData = response.data.feedbacks.filter(
          feedback => !feedback.isActive
        );
        setFeedbackData(filteredFeedbackData);
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
          const response = await axios.get(`/api/response?feedbackId=${selectedFeedback._id}`);
          setResponses(response.data);
        } catch (error) {
          console.error('Error fetching responses:', error);
          setResponses([]);
        }
      };
      fetchFeedbackResponses();
    }
  }, [selectedFeedback]);

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

  const filteredFeedbackData = selectedDepartment
    ? feedbackData.filter((feedback) =>
      feedback.feedbackTitle.includes(` ${selectedDepartment} `)
    )
    : feedbackData;
  const calculateEvaluationPointForSubject = (questionIndex, subject) => {
    let totalPoints = 0;
    let totalRatings = 0;

    response.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subject._id);
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

  const calculateAveragePointsForQuestion = (questionIndex) => {
    let totalPoints = 0;
    let totalFeedbacks = 0;

    response.forEach((feedbackEntry) => {
      selectedFeedback.subjects.forEach((subject) => {
        const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subject._id);
        if (ratingsForSubject && !isNaN(ratingsForSubject.ratings[questionIndex])) {
          totalPoints += ratingsForSubject.ratings[questionIndex];
          totalFeedbacks++;
        }
      });
    });

    return totalFeedbacks > 0 ? totalPoints / totalFeedbacks : 0;
  };

  const calculatePointsForFacultyAndQuestion = (subjectId, questionIndex) => {
    let totalPoints = 0;
    let totalRatings = 0;

    response.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subjectId);
      if (ratingsForSubject && !isNaN(ratingsForSubject.ratings[questionIndex])) {
        totalPoints += ratingsForSubject.ratings[questionIndex];
        totalRatings++;
      }
    });

    return totalRatings > 0 ? totalPoints : 0;
  };

  return (
    <div>
      <h1>Faculty Evaluation</h1>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-10 mb-4">
         
          <div>
            <Select
              defaultValue={selectedFeedbackId}
              onValueChange={(value) => setSelectedFeedback(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select feedback" />
              </SelectTrigger>
              <SelectContent>
                {filteredFeedbackData &&
                  filteredFeedbackData.map((feedback) => (
                    <SelectItem key={feedback._id} value={feedback}>{feedback.feedbackTitle}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {selectedFeedbackId && (
            <div>
              <Select
                defaultValue={feedbackMode}
                onValueChange={(value) => setFeedbackMode(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Feedback Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Feedback</SelectItem>
                  <SelectItem value="cumulative">Cumulative Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

          )}
          {feedbackMode === 'individual' && (
            <>
              <div>
                <Select defaultValue={selectedSubject} onValueChange={(value) => setSelectedSubject(value)}>
                  <SelectTrigger className="w-[200px]">
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
            </>
          )}
        </div>

        {response && response.length > 0 && feedbackMode === 'individual' && (
          <div id="table-to-print" className="bg-white rounded-lg shadow-lg p-2">
            <h2 className="text-2xl font-bold mb-2">
              Feedback Title: {selectedFeedback?.feedbackTitle} Faculty Name: {selectedSubject.faculty} Subject: {selectedSubject.subject}
            </h2>
            <p className="mb-4">Date of Feedback: {formatDate(response[0].date)} Total Feedbacks: {response.length}</p>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1">Que No</th>
                  <th className="px-2 py-1">Question</th>
                  <th className="px-2 py-1">Poor</th>
                  <th className="px-2 py-1">Average</th>
                  <th className="px-2 py-1">Good</th>
                  <th className="px-2 py-1">Very Good</th>
                  <th className="px-2 py-1">Excellent</th>
                  <th className="px-2 py-1">Evaluation Point</th>
                </tr>
              </thead>
              <tbody>
                {selectedFeedback && selectedFeedback?.questions.map((question, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1 text-sm">{question}</td>
                    {Object.values(calculateRatingCounts(index)).map((count, i) => (
                      <td key={i} className="border px-2 py-1">{count}</td>
                    ))}
                    <td className="border px-4 py-1">{calculateEvaluationPoint(index).toFixed(2)}</td>
                  </tr>
                ))}
                 <tr>
                  <td colSpan="7" className="text-right font-bold pr-4">Total</td>
                  <td className="border px-4 py-2">{calculateTotalPoints()}</td>
                  </tr>
                 <tr>
                  <td colSpan="7" className="text-right font-bold pr-4">Average</td>
                  <td className="border px-4 py-2">{calculateAveragePoints().toFixed(2)}</td>

                </tr>
              </tbody>
              
               
            
            </table>
          </div>
        )}

        {feedbackMode === 'cumulative' && (
          <div id="table-to-print" className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Cumulative Feedback</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Question</th>
                  {selectedFeedback && selectedFeedback.subjects && selectedFeedback.subjects.map((subject) => (
                    <th key={subject._id} className="px-4 py-2">{subject.faculty}</th>
                  ))}

                  <th className="px-4 py-2">Average Points</th>
                </tr>
              </thead>
              <tbody>
                {selectedFeedback.questions.map((question, questionIndex) => (
                  <tr key={questionIndex}>
                    <td className="border px-4 py-2">{question}</td>
                    {selectedFeedback && selectedFeedback.subjects && selectedFeedback.subjects.map((subject) => (
                      <td key={subject._id} className="border px-4 py-2">{calculatePointsForFacultyAndQuestion(subject._id, questionIndex)}</td>
                    ))}
                    <td className="border px-4 py-2">{calculateAveragePointsForQuestion(questionIndex).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Button onClick={printDiv}>Print</Button>
      </div>
    </div>
  );
};

export default EvaluationPage;
