"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/app/context/UserContext";
import {toast} from 'sonner'
const FeedbackForm = () => {
  const [subType, setSubType] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    feedbackTitle: '',
    selectedQuestion: [],
    subjects: [{ subject: '', faculty: '', _id: '' }],
    students: '',
    pwd: '',
    isActive: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const user = useUser();

  useEffect(() => {
    if (feedbackType && subType) {
      fetchQuestions();
    }

    if (feedbackType && feedbackType === 'event') {
      fetchEventQuestions();
    }
  }, [feedbackType, subType]);

  const fetchEventQuestions = async () => {
    try {
      const response = await axios.get(`/api/findquestions?type=event`);
      setQuestions(response.data.questions);
    
    } catch (error) {
      console.error('Error fetching event questions:', error);
      toast.error('Error fetching event questions');
    }
  };
  
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/findquestions?type=${feedbackType}&subtype=${subType}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Error fetching questions');
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('subject')) {
      const newSubjects = [...formData.subjects];
      newSubjects[index].subject = value;
      setFormData({ ...formData, subjects: newSubjects });
    } else if (name.startsWith('faculty')) {
      const newSubjects = [...formData.subjects];
      newSubjects[index].faculty = value;
      setFormData({ ...formData, subjects: newSubjects });
    } else if (name.startsWith('_id')) {
      const newSubjects = [...formData.subjects];
      newSubjects[index]._id = value;
      setFormData({ ...formData, subjects: newSubjects });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject: '', faculty: '', _id: '' }],
    });
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subjects: newSubjects,
    });
  };
  const handleCancel = () => {
    setFeedbackType('');
    setSubType('');
    setClassName('');
    setSemester('');
    setQuestions([]);
    setFormData({
      feedbackTitle: '',
      selectedQuestion: [],
      subjects: [{ subject: '', faculty: '', _id: '' }],
      students: '',
      pwd: '',
      isActive: false,
    });
    setError(null);
    setSubmitted(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormData({ ...formData, selectedQuestion: questions });
      let feedbackTitle;
      if (feedbackType === 'academic') {
        feedbackTitle = generateFeedbackTitle();
        if (!feedbackTitle) {
          throw new Error('Feedback title is required.');
        }
      } else {
        feedbackTitle = formData.feedbackTitle;
        if (!feedbackTitle) {
          throw new Error('Feedback title is required.');
        }
      }

      const updatedFormData = {
        ...formData,
        feedbackTitle: feedbackTitle,
      };
  
      await axios.post('/api/feedback', updatedFormData);
      setSubmitted(true);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  
  

  const generateFeedbackTitle = () => {
    if (user && className && semester && subType) {
      return `${user.department} ${className} ${subType.toUpperCase()} Semester ${semester} `;
    }
    return '';
  };

  return (
    <div className="flex justify-center items-center ">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-[90%]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Feedback</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Feedback Type Selector */}
        <div className="mb-4">
          <Select defaultValue={feedbackType} onValueChange={(value) => setFeedbackType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Feedback type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="event">External</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback Subtype Selector (only for academic feedback) */}
        {feedbackType === 'academic' && (
          <div className="mb-4">
            <Select defaultValue={subType} onValueChange={(value) => setSubType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Feedback Subtype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theory">Theory</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Class Name Selector */}
        <div className="mb-4">
          <Select defaultValue={className} onValueChange={(value) => setClassName(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Class name" />
            </SelectTrigger>
            <SelectContent>
              {user && user.classes.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester Selector */}
        <div className="mb-4">
          <Select defaultValue={semester} onValueChange={(value) => setSemester(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="I">Semester I</SelectItem>
              <SelectItem value="II">Semester II</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback Title Input */}
        <div className="mb-4">
          <label htmlFor="feedbackTitle" className="block mb-2">Feedback Title:</label>
          <Input
            type="text"
            id="feedbackTitle"
            name="feedbackTitle"
            value={formData.feedbackTitle || generateFeedbackTitle()}
            onChange={(e) => setFormData({ ...formData, feedbackTitle: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter feedback title"
          />
        </div>

        {/* Subject and Faculty Inputs (only for academic feedback) */}
        {feedbackType === 'academic' && formData.subjects.map((subject, index) => (
          <div className="mb-4 flex gap-4" key={index}>
            <label htmlFor={`subject${index}`} className="block mb-2">Subject {index + 1}:</label>
            <div className="flex  mb-2">
              <Input
                type="text"
                id={`subject${index}`}
                name={`subject${index}`}
                value={subject.subject}
                onChange={(e) => handleChange(e, index)}
                className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mr-2"
                placeholder="Enter subject"
              />
              <Input
                type="text"
                id={`faculty${index}`}
                name={`faculty${index}`}
                value={subject.faculty}
                onChange={(e) => handleChange(e, index)}
                className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter faculty"
              />
              <Input
                type="text"
                id={`_id${index}`}
                name={`_id${index}`}
                value={subject._id}
                onChange={(e) => handleChange(e, index)}
                className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 mr-2"
                placeholder="Enter Course Code"
              />
            </div>
            <Button type="button" onClick={() => handleRemoveSubject(index)}>
              Remove Subject
            </Button>
          </div>
        ))}
        {feedbackType === 'academic' && (
          <Button type="button" onClick={handleAddSubject}>
          Add Subject
        </Button>
        
        )}

         <div className="mb-4">
          <Select defaultValue={formData.selectedQuestion} onValueChange={(value) => handleQuestionChange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Question">Questions</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {questions.map((question) => (
                <SelectItem key={question._id} value={question}>
                  {question.feedbackType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> 

        <div className="mb-4">
          <label htmlFor="students" className="block mb-2">Number of Students:</label>
          <Input
            type="number"
            id="students"
            name="students"
            value={formData.students}
            onChange={(e) => setFormData({ ...formData, students: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter number of students"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pwd" className="block mb-2">Password:</label>
          <Input
            type="password"
            id="pwd"
            name="pwd"
            value={formData.pwd}
            onChange={(e) => setFormData({ ...formData, pwd: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="isActive" className="block mb-2">Activate Feedback:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="isActive" className="mr-4">Yes</label>
        </div>
        <div className='flex item-center justify-center gap-5'>
          <Button variant="secondary" onClick={handleCancel} varient="ghost" >
          Cancel
        </Button>
       
        <Button type="submit">
          Submit Feedback
        </Button></div>
        
        {submitted && (
          <p className="mt-4 text-green-600">Feedback submitted successfully!</p>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
