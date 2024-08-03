"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context/UserContext';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import Image from 'next/image';
const EvaluationPage = ({ role }) => {
  const [cumulativeStudentCategories, setCumulativeStudentCategories] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responses, setResponses] = useState([]);
  const [feedbackMode, setFeedbackMode] = useState('cumulative');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const user = useUser();

  useEffect(() => {
    if (user && !feedbackData == [] && role != 'Central') {
      // setSelectedDepartment(user.department)
      fetchFeedbackData(user.department);
    }
  }, [user]);

  const fetchFeedbackData = async (department) => {
    try {
      const response = await axios.get(`/api/EvalFeedback?department=${department}`);
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
      console.log(response);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setResponses([]);
    }
  };
  const printDiv = () => {
    window.print();
  };


  useEffect(() => {
    if (selectedFeedback && responses.length > 0) {
      const categories = calculateCumulativeStudentCategories();
      setCumulativeStudentCategories(categories);
    }
  }, [selectedFeedback, responses]);

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
    responses?.forEach((feedbackEntry) => {
      const suggestionForSubject = feedbackEntry?.ratings?.find(rating => rating.subject_id === subjectId);
      if (suggestionForSubject && suggestionForSubject?.suggestions) {
        suggestions.push(suggestionForSubject?.suggestions);
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

    responses?.forEach((feedbackEntry) => {
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
    if (!selectedFeedback || !selectedFeedback.questions || !selectedFeedback?.questions.length) {
      console.error('Error: Selected feedback or its questions are not properly initialized.');
      return { noProblemPercentage: 0, problemPercentage: 0 };
    }

    const noProblemPercentage = (noProblemCount / (totalResponses * selectedFeedback?.questions?.length)) * 100;
    const problemPercentage = (problemCount / (totalResponses * selectedFeedback?.questions?.length)) * 100;

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
      let totalRatings = 0;

      responses.forEach(feedbackEntry => {
        const ratingsForSubject = feedbackEntry.ratings.find(rating => rating.subject_id === subject._id);
        if (ratingsForSubject) {
          ratingsForSubject.ratings.forEach(rating => {
            if (!isNaN(rating) && rating !== null) {
              if (rating >= 4) {  // Consider 4 and 5 as "No Problem"
                noProblemCount++;
              }
              totalRatings++;
            }
          });
        }
      });

      const noProblemPercentage = totalRatings > 0 ? (noProblemCount / totalRatings) * 100 : 0;
      subjectCategories[subject._id] = { noProblemPercentage };
    });

    return subjectCategories;
  };

  const { noProblemPercentage, problemPercentage } = calculateStudentCategories(); // For individual feedback


  const renderEventFeedback = () => {
    return (
      <div id="table-to-print" className="bg-white rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-center">SKN Sinhgad College of Engineering, Pandharpur</h2>
        <h2 className="text-xl font-bold mb-2 text-center">Event Feedback</h2>
        <h2 className="text-lg font-bold mb-2 text-center">
          Event: {selectedFeedback?.feedbackTitle}
        </h2>
        <p className="mb-2">Date of Feedback: {formatDate(responses[0]?.date)} Total Feedbacks: {responses.length}</p>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-1 py-1">Question</th>
              <th className="px-1 py-1">Average Rating</th>
              <th className="px-1 py-1">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {selectedFeedback && selectedFeedback.questions.map((question, index) => {
              const avgRating = calculateEventQuestionRating(index);
              return (
                <tr key={index}>
                  <td className="border px-2 py-2 text-start min-w-[35vw]">{question}</td>
                  <td className="border text-center px-1 py-1">{avgRating.toFixed(2)}</td>
                  <td className="border text-center px-1 py-1">{calculatePercentage(avgRating).toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
          <ul className="list-disc list-inside text-left">
            {getEventSuggestions().map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const calculateEventQuestionRating = (questionIndex) => {
    let totalRating = 0;
    let count = 0;
    responses.forEach(response => {
      if (response.ratings[0] && response.ratings[0].ratings[questionIndex] !== undefined) {
        totalRating += response.ratings[0].ratings[questionIndex];
        count++;
      }
    });
    return count > 0 ? totalRating / count : 0;
  };

  const getEventSuggestions = () => {
    return responses.flatMap(response =>
      response.ratings[0] && response.ratings[0].suggestions ? [response.ratings[0].suggestions] : []
    );
  };

  const renderAnalysisForEvent = () => {
    const averageRatings = selectedFeedback.questions.map((_, index) => calculateEventQuestionRating(index));

    return (
      <div className='flex flex-col justify-center items-center mx-auto'>
        <h3 className="text-lg text-center font-semibold mt-4">Average Ratings Per Question</h3>
        <Chart
          options={{
            chart: {
              type: 'bar',
              height: 350,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                },
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: selectedFeedback.questions.map((q, index) => `Q${index + 1}`),
            },
            yaxis: {
              title: {
                text: 'Average Rating',
              },
              max: 5,
            },
            fill: {
              opacity: 1,
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val.toFixed(2);
                },
              },
            },
          }}
          series={[
            {
              name: 'Average Rating',
              data: averageRatings,
            },
          ]}
          type="bar"
          height={400}
          width={600}
        />
      </div>
    );
  };

  return (
    <div className='w-full mx-auto'>
      <h2 className='text-2xl w-full text-center mt-8 font-bold'>Faculty Evaluation</h2>
      <div className="container w-full mx-auto px-4 py-8">
        {selectedFeedback &&
          <div className='w-full items-end flex justify-end my-2'>
            <Button variant="outline" onClick={printDiv}>Print</Button>
          </div>}
        <div className="flex gap-10 mb-4 ">
          {role &&
            (<div>
              <Select
                defaultValue={selectedDepartment}
                // value={selectedDepartment}
                onValueChange={(value) => fetchFeedbackData(value)}
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
              onValueChange={(value) => setSelectedFeedback(feedbackData?.find(feedback => feedback._id === value))}
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
                onValueChange={(value) => {
                  setFeedbackMode(value);
                  setSelectedSubject(null); // Clear selected subject when changing view mode
                }}
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
          {selectedFeedback?.feedbackType === "academic" && feedbackMode === 'individual' && (
            <div>
              <Select
                onValueChange={(value) => setSelectedSubject(selectedFeedback?.subjects?.find(subject => subject._id === value))}
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
          <Tabs defaultValue="evaluation" className="w-full mx-auto flex flex-col items-center">
            <TabsList className='mx-auto justify-center items-center '>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="evaluation">
              {selectedFeedback.feedbackType === "event" ? renderEventFeedback() : (<>

                {feedbackMode === 'individual' && selectedSubject && (
                  <div id="table-to-print" className="bg-white rounded-lg  p-6  mx-auto w-full">
                    <h2 className="text-2xl font-bold mb-4 text-center mx-auto w-full ">SKN Sinhgad College of Engineering, Pandharpur</h2>
                    <h2 className="text-xl font-bold mb-4 text-center">Feedback Report</h2>
                    <h2 className="text-xl font-bold mb-2 text-center">
                      Subject: {selectedSubject.subject}
                    </h2>
                    <p className="mb-4">Date of Feedback: {formatDate(responses[0]?.date)} Total Feedbacks: {responses.length}</p>
                    <p className="mb-4">Faculty : {selectedSubject.faculty}</p>
                    <table className="w-full table-auto mx-auto">
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
              </>
              )}
            </TabsContent>
            <TabsContent id="table-to-print" value="analysis" className="flex flex-col justify-center items-center w-full">
              {selectedFeedback.feedbackType === "event" ? renderAnalysisForEvent() : (
                <>
                  {selectedFeedback && selectedSubject && (
                    <div className='flex flex-col justify-center items-center mx-auto'>
                      <h3 className="text-lg text-center font-semibold mt-4">Evaluation Points Per Question</h3>
                      <Chart
                        options={{
                          chart: {
                            type: 'bar',
                            height: 350,
                            toolbar: {
                              show: true,
                              tools: {
                                download: true,

                              },
                            },
                          },
                          plotOptions: {
                            bar: {
                              horizontal: false,
                              columnWidth: '55%',
                              endingShape: 'rounded',
                            },
                          },
                          dataLabels: {
                            enabled: false,
                          },
                          xaxis: {
                            categories: selectedFeedback.questions.map((q, index) => `Q${index + 1}`),
                          },
                          yaxis: {
                            title: {
                              text: 'Points',
                            },
                          },
                          fill: {
                            opacity: 1,
                          },
                          tooltip: {
                            y: {
                              formatter: function (val) {
                                return val;
                              },
                            },
                          },
                        }}
                        series={[
                          {
                            name: 'Points',
                            data: selectedFeedback.questions.map((_, index) => calculateEvaluationPoint(index).toFixed(2)),
                          },
                        ]}
                        type="bar"
                        height={400}
                        width={400}
                      />

                      <h3 className="text-lg font-semibold mt-4">Student Categories</h3>
                      <Chart
                        options={{
                          labels: ['No Problem', 'Problem'],
                          legend: {
                            position: 'bottom',
                          },
                          chart: {
                            toolbar: {
                              show: true,
                              tools: {
                                download: true,

                              },
                            },
                          },

                          plotOptions: {
                            pie: {
                              donut: {
                                size: '45%',
                              },
                            },
                          },
                          dataLabels: {
                            enabled: true,
                            formatter: function (val, opts) {
                              return opts.w.globals.labels[opts.seriesIndex] + ': ' + val.toFixed(2) + '%';
                            },
                          },
                        }}
                        series={[noProblemPercentage, problemPercentage]}
                        type="donut"
                        height={400}
                        width={400}

                      />
                    </div>
                  )}

                  {feedbackMode === 'cumulative' && (
                    <div className='flex flex-col justify-center items-center mx-auto'>
                      <h3 className=" text-center text-lg font-semibold mt-4">Cumulative Student Categories</h3>
                      <Chart
                        options={{
                          chart: {
                            type: 'bar',
                            toolbar: {
                              show: true,
                              tools: {
                                download: true,
                              },
                            },
                          },
                          plotOptions: {
                            bar: {
                              horizontal: false,
                              dataLabels: {
                                position: 'top', // Display data labels on top of bars
                              },
                            },
                          },
                          dataLabels: {
                            enabled: true,
                            formatter: function (val, opts) {
                              // Use the actual percentage value for the label
                              return val.toFixed(2) + '%';
                            },
                          },
                          xaxis: {
                            categories: selectedFeedback.subjects.map(subject => subject.faculty),
                          },
                          yaxis: {
                            min: 0,
                            max: 100,
                            labels: {
                              formatter: function (value) {
                                return value.toFixed(2) + '%';
                              }
                            }
                          },
                          tooltip: {
                            y: {
                              formatter: function (value) {
                                return value.toFixed(2) + '%';
                              }
                            }
                          },
                          legend: {
                            position: 'bottom',
                          },
                        }}
                        series={[{
                          name: 'No Problem Percentage',
                          data: selectedFeedback.subjects.map(subject =>
                            cumulativeStudentCategories[subject._id]?.noProblemPercentage || 0
                          )
                        }]}
                        type='bar'
                        height={400}
                        width={600}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
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
