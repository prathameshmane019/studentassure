"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/app/context/UserContext";
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@nextui-org/react"; // Import Spinner
import { FiCopy } from 'react-icons/fi';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from './ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader2 } from 'lucide-react';


const FeedbackForm = () => {
  const [userDepartment, setUserDepartment] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [subType, setSubType] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackType, setFeedbackType] = useState('event');
  const [className, setClassName] = useState('');
  const [semester, setSemester] = useState('');
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState(null);
  const [copied, setCopied] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  const [formData, setFormData] = useState({
    feedbackTitle: '',
    selectedQuestion: null,
    subjects: [{ subject: '', faculty: '', _id: '' }],
    students: '',
    pwd: '',
    department: '',
    isActive: false,
    feedbackType: ""
  });

  const user = useUser();

  useEffect(() => {
    if (user) {
      setUserDepartment(user.department);
      setFormData({ ...formData, department: user.department });
    }
  }, [user]);

  useEffect(() => {
    if (feedbackType == "academic" && (subType == "theory" || subType == "practical")) {
      fetchQuestions();
    }
    if (feedbackType && feedbackType === 'event') {
      fetchEventQuestions();
    }
  }, [feedbackType, subType]);

  const fetchEventQuestions = async () => {
    try {
      const response = await axios.get(`/api/questions?type=event`);
      setQuestions(response.data);
      console.log(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setQuestions([])
      if (feedbackType == "academic" && subType) {
        const response = await axios.get(`/api/questions?type=${feedbackType}&subtype=${subType}`);
        setQuestions(response.data[0].questions);
        console.log("Questions :", questions.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'feedbackTitle') {
      setFormData({ ...formData, feedbackTitle: value });
    }
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
    setShowFeedbackForm(false),
    setSelectedQuestionSet(null),
    setGeneratedTitle(''),
      setFormData({
        feedbackTitle: '',
        selectedQuestion: [],
        subjects: [{ subject: '', faculty: '', _id: '' }],
        students: '',
        pwd: '',
        department: "",
        isActive: false,
        feedbackType: ""
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let feedbackTitle;
      if (feedbackType === 'academic' && subType === "practical") {
        feedbackTitle = generatedTitle
        console.log(generatedTitle);
        
      }
      else
      if (feedbackType === 'academic' && subType === "theory") {
        feedbackTitle = generateFeedbackTitle();
        if (!feedbackTitle) {
          toast.error('All fields are required for academic feedback.');
          throw new Error('All fields are required for academic feedback.');
        }
      } else {
        feedbackTitle = selectedQuestionSet?.feedbackId || formData.feedbackTitle;
        if (!feedbackTitle) {
          toast.error('Feedback title is required.');
          throw new Error('Feedback title is required.');
        }
      }

      if (questions?.questions?.length == 0) {
        toast.error('Questions are missing contact to superadmin to add questions and try again.');
        throw new Error('Questions are missing contact to superadmin to add questions and try again.');
      }
      if (!formData.students || formData.students <= 0) {
        toast.error('Number of students must be a positive number.');
        throw new Error('Number of students must be a positive number.');
      }

      if (!formData.pwd) {
        toast.error('Password is required.');
        throw new Error('Password is required.');
      }

      const filteredSubjects = feedbackType === 'event' ? formData.subjects.filter(subject => subject.subject && subject.faculty && subject._id) : formData.subjects;

      const updatedFormData = {
        ...formData,
        feedbackTitle: feedbackTitle,
        feedbackType: feedbackType,
        subjects: filteredSubjects
      };
      console.log(updatedFormData);

      await axios.post('/api/feedback', updatedFormData);
      handleCancel();
      toast.success("Feedback created successfully");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
      handleCancel()
    }
  };
  const generateFeedbackTitle = () => {
    if (user && className && semester && subType && academicYear) {
      return `${academicYear} ${user.department} ${className} ${subType.toUpperCase()} Semester ${semester}`;
    }
    return '';
  };
  
  useEffect(() => {
  if (user && className && semester && subType && academicYear) {
    setGeneratedTitle(`${academicYear} ${user.department} ${className} ${subType.toUpperCase()} Semester ${semester}`);
  }
}, [user, className, semester, subType, academicYear]);

  useEffect(() => {
    if (selectedQuestionSet && questions) {
      console.log(questions);
      console.log(selectedQuestionSet);
      setFormData({ ...formData, questions: selectedQuestionSet.questions });
    } else {
      setFormData({ ...formData, questions: questions });
    }
  }, [questions, selectedQuestionSet]);

  const currentYear = new Date().getFullYear();
  const academicYearOptions = [
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`
  ];

  useEffect(() => {
    fetchFeedbacks(userDepartment);
  }, [userDepartment]);

  const fetchFeedbacks = async (department) => {
    setLoading(true); // Set loading to true when fetching feedbacks
    try {
      if (department) {
        const response = await axios.get(`/api/feedback?department=${department}`);
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks.');
    } finally {
      setLoading(false); // Set loading to false after fetching feedbacks
    }
  };


  const handleDeleteFeedback = async (id) => {
    setLoading(true); // Set loading to true when deleting feedback
    try {
      await axios.delete(`/api/feedback?_id=${id}`);
      setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
      toast.success('Feedback deleted successfully.');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback.');
    } finally {
      setLoading(false); // Set loading to false after deleting feedback
    }
  };

  const handleToggleIsActive = async (id, isActive) => {
    const feedbackToUpdate = feedbacks?.find(feedback => feedback._id === id);
    console.log(feedbackToUpdate);
    if (feedbackToUpdate.students === feedbackToUpdate?.responses?.length) {
      console.log("error");
      toast.error('Feedback is already full.');
    }
    else {
      setLoading(true); // Set loading to true when toggling feedback state
      try {
        await axios.put(`/api/feedback?_id=${id}`, { isActive: !isActive });
        const updatedFeedbacks = feedbacks?.map(feedback => {
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
      } finally {
        setLoading(false); // Set loading to false after toggling feedback state
      }
    }
  };
  const copyToClipboard = (feedbackId) => {
    const url = `${window.location.origin}/givefeedback/${feedbackId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(feedbackId);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(''), 2000);

    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy link');
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {!showFeedbackForm && (
        <div className="flex justify-end mb-8">
          <Button onClick={() => setShowFeedbackForm(true)}>Create Feedback</Button>
        </div>
      )}
      {showFeedbackForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userDepartment !== 'Central' && (
              <div>
                <Label htmlFor="feedbackType">Feedback Type *</Label>
                <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value)} required>
                  <SelectTrigger id="feedbackType" className="w-full">
                    <SelectValue placeholder="Select a Feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {feedbackType === 'event' && (
              <div>
                <Label htmlFor="questionSet">Select Question Set *</Label>
                <Select
                  value={selectedQuestionSet ? selectedQuestionSet._id : ''}
                  onValueChange={(value) => setSelectedQuestionSet(questions.find(q => q._id === value))}
                  required
                >
                  <SelectTrigger id="questionSet" className="w-full">
                    <SelectValue placeholder="Select a Question Set" />
                  </SelectTrigger>
                  <SelectContent>
                    {questions && questions.map((questionSet) => (
                      <SelectItem key={questionSet._id} value={questionSet._id}>
                        {questionSet.feedbackId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {feedbackType === 'event' && selectedQuestionSet && (
              <>
                <div>
                  <Label>Feedback Title</Label>
                  <Input
                    id="feedbackTitle"
                    type="text"
                    name="feedbackTitle"
                    value={selectedQuestionSet.feedbackId}
                    onChange={handleChange} />


                </div>
                <div>
                  <Label>Resource Person</Label>
                  <Input value={selectedQuestionSet.resourcePerson} disabled />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input value={selectedQuestionSet.organization} disabled />
                </div>
              </>
            )}

            {feedbackType === 'academic' && (
              <div>
                <Label htmlFor="subType">Feedback Subtype *</Label>
                <Select value={subType} onValueChange={(value) => setSubType(value)} required>
                  <SelectTrigger id="subType" className="w-full">
                    <SelectValue placeholder="Select a Feedback Subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="practical">Practical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {feedbackType === 'academic' && (
              <div>
                <Label htmlFor="className">Class Name *</Label>
                <Select value={className} onValueChange={(value) => setClassName(value)} required>
                  <SelectTrigger id="className" className="w-full">
                    <SelectValue placeholder="Select a Class name" />
                  </SelectTrigger>
                  <SelectContent>
                    {user && user?.classes?.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {feedbackType === 'academic' && (
              <div>
                <Label htmlFor="semester">Semester *</Label>
                <Select value={semester} onValueChange={(value) => setSemester(value)} required>
                  <SelectTrigger id="semester" className="w-full">
                    <SelectValue placeholder="Select a Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {feedbackType === 'academic' && subType === "practical" && (
              <div >
                <Label>Feedback Title</Label>
                <Input
                  id="feedbackTitle"
                  type="text"
                  name="feedbackTitle"
                  value={generatedTitle}
                  onChange={(e) => setGeneratedTitle(e.target.value)}
                />
              </div>
            )}
            {feedbackType === 'academic' && (
              <div>
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Select value={academicYear} onValueChange={(value) => setAcademicYear(value)} required>
                  <SelectTrigger id="academicYear" className="w-full">
                    <SelectValue placeholder="Select an Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYearOptions?.map((option, index) => (
                      <SelectItem key={index} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="students">Number of Students *</Label>
              <Input
                id="students"
                type="number"
                name="students"
                placeholder="Enter total number of students"
                value={formData.students}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="pwd">Password *</Label>
              <Input
                id="pwd"
                type="password"
                name="pwd"
                placeholder="Enter password"
                value={formData.pwd}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {feedbackType === 'academic' && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Subjects</h3>
              {formData.subjects.map((subject, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`subject${index}`}>Subject {index + 1} *</Label>
                    <Input
                      id={`subject${index}`}
                      type="text"
                      name={`subject${index}`}
                      placeholder={`Subject ${index + 1}`}
                      value={subject.subject}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`faculty${index}`}>Faculty {index + 1} *</Label>
                    <Input
                      id={`faculty${index}`}
                      type="text"
                      name={`faculty${index}`}
                      placeholder={`Faculty ${index + 1}`}
                      value={subject.faculty}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`_id${index}`}>Subject Code {index + 1} *</Label>
                    <Input
                      id={`_id${index}`}
                      type="text"
                      name={`_id${index}`}
                      placeholder={`Subject code ${index + 1}`}
                      value={subject._id}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>
                  <div className="md:col-span-3 mt-2 flex gap-2">
                    <Button type="button" onClick={() => handleRemoveSubject(index)}>Remove</Button>
                    {index === formData?.subjects?.length - 1 && (
                      <Button type="button" onClick={handleAddSubject}>Add Another Subject</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button type="button" onClick={handleCancel}>Cancel</Button>
            <Button type="submit">Create Feedback</Button>
          </div>
        </form>
      )
      }

      {
        !showFeedbackForm && (
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feedback Title</TableHead>
                    <TableHead>Number of Students</TableHead>
                    <TableHead>Number of Responses</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(feedbacks) && feedbacks?.map((feedback) => (
                    <TableRow key={feedback._id}>
                      <TableCell>{feedback.feedbackTitle}</TableCell>
                      <TableCell>{feedback.students}</TableCell>
                      <TableCell>{feedback.responses.length}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><button
                              onClick={() => copyToClipboard(feedback._id)}
                              className="mr-2 transition-transform transform hover:scale-105"
                            >
                              <FiCopy className={`w-5 h-5 ${copied === feedback._id ? 'animate-pulse' : ''}`} />
                            </button></TooltipTrigger>
                            <TooltipContent>
                              <p>Copy Link</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={feedback.isActive}
                          onCheckedChange={() => handleToggleIsActive(feedback._id, feedback.isActive)}
                        />
                      </TableCell>
                      <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteFeedback(feedback._id) }>
                      Delete
                    </Button>
                  </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )
      }
    </div >
  );
};
export default FeedbackForm;
