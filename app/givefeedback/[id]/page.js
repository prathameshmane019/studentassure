// "use client"
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';

// const FeedbackForm = ({ params }) => {
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
//   const [formData, setFormData] = useState({
//     feedback_id: '',
//     responses: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isPasswordVerified, setIsPasswordVerified] = useState(false);
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   let feedbackId;
//   useEffect(()=>{
//     if(params){
//       feedbackId = params.id
//     }
//   })

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/api/fetchFeedback?_id=${feedbackId}`);
//         setSelectedFeedback(response.data);
//         setFormData({
//           feedback_id: feedbackId,
//           responses: response.data.subjects.map((subject) => ({
//             subject_id: subject._id,
//             ratings: [],
//             suggestions: '',
//           })),
//         });
//       } catch (error) {
//         setError('Error fetching feedback data');
//         toast.error('Error fetching feedback data');
//       }
//       setLoading(false);
//     };

//     if (feedbackId) {
//       fetchFeedback();
//     }
//   }, [feedbackId]);

//   const handleNextSubject = (e) => {
//     e.preventDefault();
//     const currentResponses = formData.responses[currentSubjectIndex];
//     const hasEmptyRating = currentResponses.ratings.some(rating => !rating);
//     if (!hasEmptyRating) {
//       if (currentSubjectIndex < selectedFeedback.subjects.length - 1) {
//         setCurrentSubjectIndex((prevIndex) => prevIndex + 1);
//       } else {
//         handleSubmit(e);
//       }
//     } else {
//       setError('Please rate all questions before proceeding');
//     }
//   };

//   const handleRatingChange = (subjectIndex, questionIndex, rating) => {
//     setFormData((prevFormData) => {
//       const updatedResponses = [...prevFormData.responses];
//       const updatedRatings = [...updatedResponses[subjectIndex].ratings];
//       updatedRatings[questionIndex] = rating;
//       updatedResponses[subjectIndex] = {
//         ...updatedResponses[subjectIndex],
//         ratings: updatedRatings,
//       };
//       return {
//         ...prevFormData,
//         responses: updatedResponses,
//       };
//     });
//   };

//   const handleSuggestionsChange = (subjectIndex, suggestions) => {
//     setFormData((prevFormData) => {
//       const updatedResponses = [...prevFormData.responses];
//       updatedResponses[subjectIndex] = {
//         ...updatedResponses[subjectIndex],
//         suggestions,
//       };
//       return {
//         ...prevFormData,
//         responses: updatedResponses,
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/response', {
//         feedback_id: formData.feedback_id,
//         responses: formData.responses,
//       });
//       toast.success("Feedback submitted successfully");
//       router.replace("/");
//     } catch (error) {
//       setError('Failed to submit response. Please try again.');
//       toast.error('Failed to submit response. Please try again.');
//     }
//   };

//   const handleSubmitPassword = async (e) => {
//     e.preventDefault();
//     try {
//       if (selectedFeedback.pwd === password) {
//         setIsPasswordVerified(true);
//       } else {
//         setError('Incorrect password');
//       }
//     } catch (error) {
//       setError('Error verifying password');
//     }
//   };

//   if (loading) {
//     return <p className="text-center">Loading...</p>;
//   }

//   if (!isPasswordVerified) {
//     return (
//       <div className="flex flex-col items-center min-h-screen bg-gray-100">
//         <div className="max-w-3xl w-full px-4 py-8 bg-white shadow-md rounded-lg mt-8">
//           <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Verify Password</h2>
//           {error && <p className="text-red-600 text-center mb-4">{error}</p>}
//           <form onSubmit={handleSubmitPassword} className="bg-white p-8 rounded-md shadow-md">
//             <div className="mb-4">
//               <label htmlFor="password" className="block mb-2 text-gray-700">
//                 Enter Password:
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//                 required
//               />
//             </div>
//             <Button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
//             >
//               Submit Password
//             </Button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100">
//       <div className="max-w-3xl w-full px-4 py-8 bg-white shadow-md rounded-lg mt-8">
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Submit Response</h2>
//         {error && <p className="text-red-600 text-center mb-4">{error}</p>}
//         <form onSubmit={handleNextSubject} className="bg-white p-8 rounded-md shadow-md">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800">
//             {selectedFeedback.subjects[currentSubjectIndex].subject}
//           </h3>
//           <p className="text-gray-600 mb-2">
//             Faculty: {selectedFeedback.subjects[currentSubjectIndex].faculty}
//           </p>
//           {selectedFeedback.questions.map((question, qIndex) => (
//             <div key={qIndex} className="mb-4">
//               <label className="block mb-2 text-gray-700">{question}</label>
//               <div className="flex items-center">
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <React.Fragment key={rating}>
//                     <input
//                       type="radio"
//                       id={`${currentSubjectIndex}-${qIndex}-${rating}`}
//                       name={`${currentSubjectIndex}-${qIndex}`}
//                       value={rating}
//                       checked={formData.responses[currentSubjectIndex]?.ratings[qIndex] === rating}
//                       onChange={() => handleRatingChange(currentSubjectIndex, qIndex, rating)}
//                       className="mr-2"
//                       required
//                     />
//                     <label htmlFor={`${currentSubjectIndex}-${qIndex}-${rating}`} className="mr-4 text-gray-700">
//                       {rating}
//                     </label>
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>
//           ))}
//           <div className="mb-4">
//             <label htmlFor="suggestions" className="block mb-2">
//               Suggestions:
//             </label>
//             <textarea
//               id="suggestions"
//               name="suggestions"
//               value={formData.responses[currentSubjectIndex]?.suggestions || ''}
//               onChange={(e) => handleSuggestionsChange(currentSubjectIndex, e.target.value)}
//               className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <Button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
//           >
//             {currentSubjectIndex === selectedFeedback.subjects.length - 1 ? 'Submit Response' : 'Next Subject'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FeedbackForm;



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
  })

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/fetchFeedback?_id=${feedbackId}`);
        setSelectedFeedback(response.data);
        setFormData({
          feedback_id: feedbackId,
          responses: response.data.subjects.map((subject) => ({
            subject_id: subject._id,
            ratings: [],
            suggestions: '',
          })),
        });
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
    const currentResponses = formData.responses[currentSubjectIndex];
    const hasEmptyRating = currentResponses.ratings.length < selectedFeedback.questions.length;
    console.log(hasEmptyRating);
    
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
        setError("")
      }
    }
    else{
      setError('Please rate all questions before proceeding');
      toast.error('Please rate all questions before proceeding');
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
    setIsSubmitting(true);
    try {
      await axios.post('/api/response', {
        feedback_id: formData.feedback_id,
        responses: formData.responses,
      });
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
          <h3 className="text-2xl font-semibold mb-2">
            {selectedFeedback.subjects[currentSubjectIndex].subject}
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Faculty: {selectedFeedback.subjects[currentSubjectIndex].faculty}
          </p>
          {selectedFeedback.questions.map((question, qIndex) => (
            <React.Fragment key={qIndex}>
              <div className="mb-6">
                <Label className="text-lg font-medium mb-2">{question}</Label>
                <RadioGroup
                  onValueChange={(value) => handleRatingChange(currentSubjectIndex, qIndex, parseInt(value))}
                  value={formData.responses[currentSubjectIndex].ratings[qIndex]?.toString() || ''}
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
              value={formData.responses[currentSubjectIndex]?.suggestions || ''}
              onChange={(e) => handleSuggestionsChange(currentSubjectIndex, e.target.value)}
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
              currentSubjectIndex === selectedFeedback.subjects.length - 1 ? 'Submit Response' : 'Next Subject'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;