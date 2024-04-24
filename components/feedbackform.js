"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/app/context/UserContext";
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const FeedbackForm = () => {

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [subType, setSubType] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    feedbackTitle: '',
    selectedQuestion: null,
    subjects: [{ subject: '', faculty: '', _id: '' }],
    students: '',
    pwd: '',
    isActive: false,
  });

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
      const response = await axios.get(`/api/questions?type=event`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/questions?type=${feedbackType}&subtype=${subType}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);

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
    setShowFeedbackForm(false)
    setFormData({
      feedbackTitle: '',
      selectedQuestion: [],
      subjects: [{ subject: '', faculty: '', _id: '' }],
      students: '',
      pwd: '',
      isActive: false,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let feedbackTitle;
      if (feedbackType === 'academic') {
        feedbackTitle = generateFeedbackTitle();
        if (!feedbackTitle) {
          toast.error('Feedback title is required.');
          throw new Error('Feedback title is required.');
        }
        setShowFeedbackForm(false)
      } else {
        feedbackTitle = formData.feedbackTitle;
        if (!feedbackTitle) {
          toast.error('Feedback title is required.');
          throw new Error('Feedback title is required.');
        }
      }

      const updatedFormData = {
        ...formData,
        feedbackTitle: feedbackTitle,
      };

      await axios.post('/api/feedback', updatedFormData);
      handleCancel()
      toast.success("Feedback created successfully")
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };
  const generateFeedbackTitle = () => {
    if (user && className && semester && subType && academicYear) {
      return `${academicYear} ${user.department} ${className} ${subType.toUpperCase()} Semester ${semester}`;
    }
    return '';
  };


  useEffect(() => {
    if (questions?.length > 0) {
      setFormData({ ...formData, selectedQuestion: questions });
    }
  }, [questions]);

  const currentYear = new Date().getFullYear();
  const academicYearOptions = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`
  ];


  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/feedback');
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks.');
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`/api/feedback?_id=${id}`);
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
      toast.success('Feedback deleted successfully.');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback.');
    }
  };

  const handleToggleIsActive = async (id, isActive) => {
    try {
      console.log(id, isActive);
      await axios.put(`/api/feedback?_id=${id}`, { isActive: !isActive });
      const updatedFeedbacks = feedbacks.map(feedback => {
        if (feedback._id === id) {
          return { ...feedback, isActive: !isActive };
        }
        return feedback;
      });
      setFeedbacks(updatedFeedbacks);
      toast.success('Feedback state updated successfully.');
    } catch (error) {
      console.error('Error updating feedback state:', error);
      toast.error('Failed to update feedback state.');
    }
  };

  return (
    <div className="flex justify-center items-center flex-col overflow-y-auto">{!showFeedbackForm && (
      <div className="flex justify-end m-8 w-[90%]">
        <Button onClick={() => setShowFeedbackForm(true)}>Create Feedback</Button>
      </div>
    )}
      {showFeedbackForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md w-[90%]">
          <h2 className="text-2xl font-semibold mb-4 text-center">Create Feedback</h2>
          <div className="mb-4">
            <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="event">External</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {feedbackType === 'academic' && (
            <div className="mb-4">
              <Select value={subType} onValueChange={(value) => setSubType(value)}>
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

          <div className="mb-4">
            <Select value={className} onValueChange={(value) => setClassName(value)}>
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

          <div className="mb-4">
            <Select value={semester} onValueChange={(value) => setSemester(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="I">Semester I</SelectItem>
                <SelectItem value="II">Semester II</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={academicYear} onValueChange={(value) => setAcademicYear(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </form>
      )}
      <div className='w-[90%]'>
        <h2 className="text-2xl font-semibold mb-4">Feedbacks</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Feedback Title</TableHead>
              <TableHead className="w-[20%]">Responses</TableHead>
              <TableHead className="w-[20%]">students</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
              <TableHead className="w-[15%]">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks && feedbacks.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell className="font-medium text-left">{feedback.feedbackTitle}</TableCell>
                <TableCell className="font-medium text-left">{feedback.responses.length}</TableCell>
                <TableCell className="font-medium text-left">{feedback.students}</TableCell>

                <TableCell>

                  <Button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={feedback.isActive}
                    onCheckedChange={(value) => handleToggleIsActive(feedback._id, feedback.isActive)}
                    disabled={false}
                  />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default FeedbackForm;
