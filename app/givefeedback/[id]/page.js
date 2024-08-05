"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

const FeedbackForm = ({ params }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [formData, setFormData] = useState({
    feedback_id: '',
    responses: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  let feedbackId;

  useEffect(() => {
    if (params) {
      feedbackId = params.id
    }
  }, [params])
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/fetchFeedback?_id=${feedbackId}`);
        setSelectedFeedback(response.data);
        console.log('Selected Feedback:', response.data);

        let newFormData;
        if (response.data.feedbackType === 'academic') {
          newFormData = {
            feedback_id: feedbackId,
            responses: response.data.subjects.map((subject) => ({
              subject_id: subject._id,
              ratings: [],
              suggestions: '',
            })),
          };
        } else {
          newFormData = {
            feedback_id: feedbackId,
            responses: [{
              ratings: new Array(response.data.questions.length).fill(null),
              suggestions: '',
            }],
          };
        }
        setFormData(newFormData);
        console.log('Initial Form Data:', newFormData);
      } catch (error) {
        setError('Error fetching feedback data');
        toast.error('Error fetching feedback data');
      }
      setLoading(false);
    };

    if (feedbackId) {
      fetchFeedback();
    }
  }, [feedbackId]);

  const handleNextSubject = (e) => {
    e.preventDefault();
    if (selectedFeedback.feedbackType === 'academic') {
      const currentResponses = formData.responses[currentSubjectIndex];
      const hasEmptyRating = currentResponses.ratings.length < selectedFeedback.questions.length;

      if (!hasEmptyRating) {
        if (currentSubjectIndex < selectedFeedback.subjects.length - 1) {
          setFormData(prevFormData => {
            const updatedResponses = [...prevFormData.responses];
            updatedResponses[currentSubjectIndex + 1] = {
              ...updatedResponses[currentSubjectIndex + 1],
              ratings: [],
            };
            return {
              ...prevFormData,
              responses: updatedResponses,
            };
          });
          setCurrentSubjectIndex((prevIndex) => prevIndex + 1);
          setError("")
        } else {
          handleSubmit(e);
        }
      } else {
        setError('Please rate all questions before proceeding');
        toast.error('Please rate all questions before proceeding');
      }
    } else {
      // For event feedback, submit directly
      handleSubmit(e);
    }
  };
  
  const handleRatingChange = (questionIndex, rating) => {
    console.log('Handling rating change:', questionIndex, rating);
    if (selectedFeedback.feedbackType === 'academic') {
      setFormData((prevFormData) => {
        const updatedResponses = [...prevFormData.responses];
        const updatedRatings = [...updatedResponses[currentSubjectIndex].ratings];
        updatedRatings[questionIndex] = rating;
        updatedResponses[currentSubjectIndex] = {
          ...updatedResponses[currentSubjectIndex],
          ratings: updatedRatings,
        };
        return {
          ...prevFormData,
          responses: updatedResponses,
        };
      });
    } else {
      setFormData((prevFormData) => {
        const updatedResponses = [...prevFormData.responses];
        updatedResponses[0] = {
          ...updatedResponses[0],
          ratings: [
            ...updatedResponses[0].ratings.slice(0, questionIndex),
            rating,
            ...updatedResponses[0].ratings.slice(questionIndex + 1)
          ],
        };
        return {
          ...prevFormData,
          responses: updatedResponses,
        };
      });
    }
  };

  const handleSuggestionsChange = (suggestions) => {
    if (selectedFeedback.feedbackType === 'academic') {
      setFormData((prevFormData) => {
        const updatedResponses = [...prevFormData.responses];
        updatedResponses[currentSubjectIndex] = {
          ...updatedResponses[currentSubjectIndex],
          suggestions,
        };
        return {
          ...prevFormData,
          responses: updatedResponses,
        };
      });
    } else {
      setFormData((prevFormData) => {
        const updatedResponses = [...prevFormData.responses];
        updatedResponses[0] = {
          ...updatedResponses[0],
          suggestions,
        };
        return {
          ...prevFormData,
          responses: updatedResponses,
        };
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/response', formData);
      toast.success("Feedback submitted successfully");
      router.replace("/");
    } catch (error) {
      setError('Failed to submit response. Please try again.');
      toast.error('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedFeedback.pwd === password) {
        setIsPasswordVerified(true);
        setError("")
      } else {
        setError('Incorrect password');
        toast.error('Incorrect password');
      }
    } catch (error) {
      setError('Error verifying password');
      toast.error('Error verifying password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isPasswordVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Verify Password</h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmitPassword}>
            <div className="mb-4">
              <Label htmlFor="password" className="block mb-2">
                Enter Password:
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Submit Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Submit Response</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleNextSubject}>
          {selectedFeedback.feedbackType === 'academic' ? (
            <>
              <h3 className="text-2xl font-semibold mb-2">
                {selectedFeedback.subjects[currentSubjectIndex].subject}
              </h3>
              <p className="text-lg text-gray-600 mb-2">
                Faculty: {selectedFeedback.subjects[currentSubjectIndex].faculty}
              </p>
            </>
          ) : (
            <>
             <h3 className="text-2xl font-semibold mb-2">
                {selectedFeedback.feedbackTitle}
              </h3>
              {selectedFeedback.resourcePerson && <p className="text-lg text-gray-600 mb-2">Resource Person: {selectedFeedback.resourcePerson}</p>}
            {selectedFeedback.organization && <p className="text-lg text-gray-600 mb-2">Organization : {selectedFeedback.organization}</p>}
            {selectedFeedback.note && <p className="text-lg text-gray-600 mb-2">Note : {selectedFeedback.note}</p>}

             
            </>
          )}
          {selectedFeedback.questions.map((question, qIndex) => (
            <React.Fragment key={qIndex}>
              <div className="mb-6">
                <Label className="text-lg font-medium mb-2">{question}</Label>
                <RadioGroup
                  onValueChange={(value) => handleRatingChange(qIndex, parseInt(value))}
                  value={
                    selectedFeedback.feedbackType === 'academic'
                      ? formData.responses[currentSubjectIndex]?.ratings[qIndex]?.toString() || ''
                      : formData.responses[0]?.ratings[qIndex]?.toString() || ''
                  }
                  className="flex space-x-4 mt-2"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <RadioGroupItem
                        value={rating.toString()}
                        id={`${currentSubjectIndex}-${qIndex}-${rating}`}
                        className="mr-2"
                        required
                      />
                      <Label htmlFor={`${currentSubjectIndex}-${qIndex}-${rating}`}>{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {qIndex < selectedFeedback.questions.length - 1 && <Separator className="my-6" />}
            </React.Fragment>
          ))}
          <div className="mb-6">
            <Label htmlFor="suggestions" className="text-lg font-medium mb-2">
              Suggestions:
            </Label>
            <Textarea
              id="suggestions"
              value={
                selectedFeedback.feedbackType === 'academic'
                  ? formData.responses[currentSubjectIndex]?.suggestions || ''
                  : formData.responses[0]?.suggestions || ''
              }
              onChange={(e) => handleSuggestionsChange(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              selectedFeedback.feedbackType === 'academic' && currentSubjectIndex < selectedFeedback.subjects.length - 1
                ? 'Next Subject'
                : 'Submit Response'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;