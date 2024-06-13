"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context/UserContext';
import Image from 'next/image';
const EvaluationPage = ({role}) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responses, setResponses] = useState([]);
  const [feedbackMode, setFeedbackMode] = useState('cumulative');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const user = useUser();
  useEffect(() => {
    if (user && !feedbackData == [] && !role=="admin") {
      fetchFeedbackData(user.department);
    }
    if(role=="Central" && !feedbackData == []){
      console.log(selectedDepartment);
      fetchFeedbackData(selectedDepartment);
    }
  }, [user]);


  const fetchFeedbackData = async (department) => {
    try {
      const response = await axios.get(`/api/feedback?department=${department}`);
      const filteredFeedbackData = response.data.filter(
        feedback => !feedback.isActive
      );
      setFeedbackData(filteredFeedbackData);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  useEffect(() => {
    if (selectedFeedback) {
      fetchFeedbackResponses(selectedFeedback._id);
    }
  }, [selectedFeedback]);

  const fetchFeedbackResponses = async (feedbackId) => {
    try {
      const response = await axios.get(`/api/response?feedbackId=${feedbackId}`);
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setResponses([]);
    }
  };
  const printDiv = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  };

  const calculateEvaluationPoint = (questionIndex) => {
    let totalPoints = 0;
    let totalRatings = 0;

    responses.forEach((feedbackEntry) => {
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
    responses.forEach((feedbackEntry) => {
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
    responses.forEach((feedbackEntry) => {
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
    return totalPoints / (responses.length * totalQuestions);
  };
  const calculateAveragePointsForSubject = (subjectId) => {
    let totalPoints = 0;
    let totalRatings = 0;

    responses.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subjectId);
      if (ratingsForSubject) {
        ratingsForSubject.ratings.forEach((rating) => {
          if (!isNaN(rating) && rating !== null) {
            totalPoints += rating;
            totalRatings++;
          }
        });
      }
    });

    return totalRatings > 0 ? totalPoints / totalRatings : 0;
  };

  const calculatePointsForFacultyAndQuestion = (subjectId, questionIndex) => {
    let totalPoints = 0;
    let totalRatings = 0;

    responses.forEach((feedbackEntry) => {
      const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subjectId);
      if (ratingsForSubject && !isNaN(ratingsForSubject.ratings[questionIndex])) {
        totalPoints += ratingsForSubject.ratings[questionIndex];
        totalRatings++;
      }
    });

    return totalRatings > 0 ? totalPoints : 0;
  };
  const getSuggestionsForSubject = (subjectId) => {
    const suggestions = [];
    responses.forEach((feedbackEntry) => {
      const suggestionForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subjectId);
      if (suggestionForSubject && suggestionForSubject.suggestions) {
        suggestions.push(suggestionForSubject.suggestions);
      }
    });
    return suggestions;
  };

  const calculatePercentage = (averagePoints) => {
    const maxPoints = 5; // Maximum possible points per question
    return (averagePoints / maxPoints) * 100;
  };
  const calculateStudentCategories = () => {
    const noProblemRatings = [4, 5]; // Ratings indicating no problem
    const totalResponses = responses.length;
    let noProblemCount = 0;
    let problemCount = 0;

    responses.forEach((feedbackEntry) => {
      if (selectedSubject) { // Add a guard clause to check if selectedSubject is not null
        const ratingsForSubject = feedbackEntry?.ratings.find(rating => rating.subject_id === selectedSubject._id);
        if (ratingsForSubject) {
          ratingsForSubject.ratings.forEach((rating) => {
            if (!isNaN(rating) && rating !== null) {
              if (noProblemRatings.includes(rating)) {
                noProblemCount++;
              } else {
                problemCount++;
              }
            }
          });
        }
      }
    });

    // Check if selectedFeedback is defined before accessing questions
    if (!selectedFeedback || !selectedFeedback.questions || !selectedFeedback.questions.length) {
      console.error('Error: Selected feedback or its questions are not properly initialized.');
      return { noProblemPercentage: 0, problemPercentage: 0 };
    }

    const noProblemPercentage = (noProblemCount / (totalResponses * selectedFeedback.questions.length)) * 100;
    const problemPercentage = (problemCount / (totalResponses * selectedFeedback.questions.length)) * 100;

    return { noProblemPercentage, problemPercentage };
  };

  const calculateCumulativeStudentCategories = () => {
    if (!selectedFeedback || !selectedFeedback.subjects) {
      return {};
    }

    const totalResponses = responses.length;
    const subjectCategories = {};

    selectedFeedback.subjects.forEach(subject => {
      let noProblemCount = 0;
      let problemCount = 0;

      responses.forEach(feedbackEntry => {
        const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subject._id);
        if (ratingsForSubject) {
          ratingsForSubject.ratings.forEach(rating => {
            if (!isNaN(rating) && rating !== null) {
              if (rating > 3) {
                noProblemCount++;
              } else {
                problemCount++;
              }
            }
          });
        }
      });

      const totalRatings = selectedFeedback.questions.length * totalResponses;
      const noProblemPercentage = (noProblemCount / totalRatings) * 100;
      const problemPercentage = (problemCount / totalRatings) * 100;

      subjectCategories[subject._id] = { noProblemPercentage, problemPercentage };
    });

    return subjectCategories;
  };

  const cumulativeStudentCategories = calculateCumulativeStudentCategories();

  const { noProblemPercentage, problemPercentage } = calculateStudentCategories(); // For individual feedback

  return (
    <div>
      <h2 className='text-2xl w-full text-center mt-8 font-bold'>Faculty Evaluation</h2>
      <div className="container w-full mx-auto px-4 py-8">
        {selectedFeedback && 
      <div className='w-full items-end flex justify-end my-2'>
              <Button onClick={printDiv}>Print</Button>
              </div>}
        <div className="flex gap-10 mb-4">
          {role && 
          (<div>
            <Select
              defaultValue={selectedDepartment}
              onValueChange={(value) => setSelectedDepartment(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="Central" value="Central">CENTRAL</SelectItem>
                <SelectItem key="CSE" value="CSE">CSE</SelectItem>
                <SelectItem key="ENTC" value="ENTC">ENTC</SelectItem>
                <SelectItem key="ELEC" value="ELEC">ELECTRICAL</SelectItem>
                <SelectItem key="MECH" value="MECH">MECHANICAL</SelectItem>
                <SelectItem key="Civil" value="Civil">CIVIL</SelectItem>
              </SelectContent>
            </Select>
          
          </div>)
            }
          <div>
            <Select
              onValueChange={(value) => setSelectedFeedback(feedbackData.find(feedback => feedback._id === value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Feedback</SelectLabel>
                  {feedbackData &&
                    feedbackData.map((feedback) => (
                      <SelectItem key={feedback._id} value={feedback._id}>
                        {feedback.feedbackTitle}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedFeedback?.feedbackType === "academic" && (
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
            <div>
              <Select
                // defaultValue={selectedFeedback.subjects[0]}
                onValueChange={(value) => setSelectedSubject(selectedFeedback.subjects.find(subject => subject._id === value))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Subject</SelectLabel>
                    {selectedFeedback && selectedFeedback.subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.subject}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {selectedFeedback ? <>
          {feedbackMode === 'individual' && selectedSubject && (
            <div id="table-to-print" className="bg-white rounded-lg  p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">SKN Sinhgad College of Engineering, Pandharpur</h2>
              <h2 className="text-xl font-bold mb-4 text-center">Feedback Report</h2>
              <h2 className="text-xl font-bold mb-2 text-center">
                Subject: {selectedSubject.subject}
              </h2>
              <p className="mb-4">Date of Feedback: {formatDate(responses[0]?.date)} Total Feedbacks: {responses.length}</p>
              <p className="mb-4">Faculty : {selectedSubject.faculty}</p>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-1 py-1 text-sm">Que No</th>
                    <th className="px-1 py-1 text-sm">Question</th>
                    <th className="px-1 py-1 text-sm">Poor</th>
                    <th className="px-1 py-1 text-sm">Average</th>
                    <th className="px-1 py-1 text-sm">Good</th>
                    <th className="px-1 py-1 text-sm">Very Good</th>
                    <th className="px-1 py-1 text-sm">Excellent</th>
                    <th className="px-1 py-1 text-sm">Evaluation Point</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFeedback && selectedFeedback.questions.map((question, index) => (
                    <tr key={index}>
                      <td className="border px-1 py-1 text-center">{index + 1}</td>
                      <td className="border min-w-[40vw] px-2 py-2 text-sm ">{question}</td>
                      {Object.values(calculateRatingCounts(index)).map((count, i) => (
                        <td key={i} className="border px-1 py-1 text-center">{count}</td>
                      ))}
                      <td className="border px-1 py-1 text-center">{calculateEvaluationPoint(index).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="7" className="border text-start font-bold pl-4">Total</td>
                    <td className="border px-1 py-1 text-center ">{calculateTotalPoints()}</td>
                  </tr>
                  <tr>
                    <td colSpan="7" className="  border text-start font-bold pl-4">Average</td>
                    <td className="border px-1 py-1 text-center">{calculateAveragePoints().toFixed(2)}</td>
                  </tr>
                  <tr >
                    <td colSpan="7" className=" border text-start font-bold pl-4">Percentage</td>
                    <td className="border px-1 py-1 text-center">
                      {calculatePercentage(calculateAveragePoints()).toFixed(2)}%
                    </td>
                  </tr>
                  <tr >
                    <td colSpan="7" className="border text-start font-bold pl-4">No Problem: </td>
                    <td className="border px-1 py-1 text-center">
                      {noProblemPercentage.toFixed(2)}%
                    </td>
                  </tr>

                </tbody>
              </table>
              <div className="mt-4">
                <h3 className="text-lg font-bold">Suggestions for {selectedSubject.faculty}:</h3>
                <ul className="list-disc list-inside">
                  {getSuggestionsForSubject(selectedSubject._id).map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}
          {(selectedFeedback?.feedbackType === "event" || feedbackMode === 'cumulative') && (
            <div id="table-to-print" className="bg-white rounded-lg  p-6 text-center">
              <h2 className="text-xl font-bold mb-2 text-center">SKN Sinhgad College of Engineering, Pandharpur</h2>
              <h2 className="text-xl font-bold mb-2 text-center">Cumulative Feedback</h2>
              <h2 className="text-lg font-bold mb-2 text-center">
                Feedback Title: {selectedFeedback?.feedbackTitle}
              </h2>
              <p className="mb-2">Date of Feedback: {formatDate(responses[0]?.date)} Total Feedbacks: {responses.length}</p>
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-1 py-1">Question</th>
                    {selectedFeedback && selectedFeedback.subjects && selectedFeedback.subjects.map(subject => (
                      <th key={subject._id} className="px-1 text-sm">{subject.faculty}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedFeedback && selectedFeedback.questions.map((question, questionIndex) => (
                    <tr key={questionIndex}>
                      <td className="border px-2 py-2 text-start min-w-[35vw]">{question}</td>
                      {selectedFeedback.subjects.map(subject => (
                        <td key={subject._id} className="border text-center px-1 py-1">{calculatePointsForFacultyAndQuestion(subject._id, questionIndex)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th className="px-1 py-1 border text-start">Average Points</th>
                    {selectedFeedback && selectedFeedback.subjects.map(subject => (
                      <td key={subject._id} className="border px-1 text-center">{calculateAveragePointsForSubject(subject._id).toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th className="px-1 py-1 border text-start">Percentage</th>
                    {selectedFeedback && selectedFeedback.subjects.map(subject => (
                      <td key={subject._id} className="border px-1 text-center">
                        {calculatePercentage(calculateAveragePointsForSubject(subject._id)).toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="px-1 py-1 border text-start">No Problem Percentage</th>
                    {selectedFeedback && selectedFeedback.subjects.map(subject => (
                      <td key={subject._id} className="border px-1 text-center">
                        {cumulativeStudentCategories[subject._id]?.noProblemPercentage.toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th>Faculty</th>
                      <th>Suggestions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFeedback && selectedFeedback.subjects.map(subject => (
                      <tr key={subject._id}>
                        <td className=" border px-1 py-1 text-start">{subject.faculty}</td>
                        <td className="border px-1 py-1 text-start">
                          {getSuggestionsForSubject(subject._id).map((suggestion, index) => (
                            <div className="flex" key={index}>{suggestion}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </> :
          <div className='w-full flex justify-center items-center'>
            <Image
              src="/feedback.svg"
              width={600}
              height={600}
              alt="Picture of the author"
            /></div>}
      </div>
    </div>
  );
};

export default EvaluationPage;
