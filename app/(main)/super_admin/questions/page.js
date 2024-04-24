"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const QuestionForm = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [subType, setSubType] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);

  const fetchSavedQuestions = async () => {
    try {
      const response = await axios.get("/api/questions");
      setSavedQuestions(response.data);
      console.log(savedQuestions);
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch questions");
    }
  };

  useEffect(() => {
    fetchSavedQuestions();

  }, []);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { feedbackType, subType, questions };
    try {
      const response = await axios.post("/api/questions", data);
      console.log(response.data);
      setQuestions([]); // Reset the questions state after successful submission
      fetchSavedQuestions(); // Fetch updated questions after submission
      toast.success("Questions added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add questions");
    }
  };

  const handleDeleteQuestionSet = async (questionSetId) => {
    try {
      // Send a DELETE request to your backend API to delete the question set
      await axios.delete(`/api/questions?_id=${questionSetId}`);
      // After successful deletion, fetch updated questions
      fetchSavedQuestions();
      toast.success("Questions set deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete questions set");
    }
  };
  

  return (
    <div className="container mx-auto my-8 h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[50vh]">
        {/* Add Questions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add Questions</CardTitle>
            <CardDescription>Please generate questions for feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <Select
                  value={feedbackType}
                  onValueChange={(value) => setFeedbackType(value)}
                  required
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>Select a Feedback type</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {feedbackType === "academic" && (
                <div className="mb-4">
                  <Select
                    value={subType}
                    onValueChange={(value) => setSubType(value)}
                    required
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>Select a sub type</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theory">Theory</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex mb-4">
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-1 mr-2"
                  required
                />
                <Button type="button" onClick={addQuestion}>
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" onClick={handleSubmit} disabled={!feedbackType || (feedbackType === "academic" && !subType) || questions.length === 0}>
              Save
            </Button>
          </CardFooter>
        </Card>
{/* Saved Questions Section */}
<Card className='overflow-y-auto'>
  <CardHeader>
    <CardTitle>Saved Questions</CardTitle>
  </CardHeader>
  <CardContent>
    {savedQuestions && savedQuestions.length > 0 ? (
      savedQuestions.map((questionSet, index) => (
        <div key={index} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              {questionSet.feedbackType}{" "}
              {questionSet.subType && `- ${questionSet.subType}`}
            </h3>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDeleteQuestionSet(questionSet._id)}
            >
              Delete Set
            </Button>
          </div>
          {questionSet.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-2">
              <Textarea
                value={question}
                disabled
                className="w-full"
              />
            </div>
          ))}
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">
        No questions saved yet.
      </p>
    )}
  </CardContent>
</Card>


      </div>

      {/* Added Questions Preview Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Added Questions</h2>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={index} className="mb-4 flex items-center">
              <Textarea
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="flex-1 mr-2"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeQuestion(index)}
                className="ml-2"
              >
                Remove
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No questions added yet. Please add questions above.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;