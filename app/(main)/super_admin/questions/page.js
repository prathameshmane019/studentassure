"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"
import { X } from 'lucide-react';
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
  const [feedbackType, setFeedbackType] = useState("academic");
  const [subType, setSubType] = useState("theory");
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [feedbackId, setFeedbackId] = useState("");
  const [resourcePerson, setResourcePerson] = useState("");
  const [organization, setOrganization] = useState("");
  const [note, setNote] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [questionSetToDelete, setQuestionSetToDelete] = useState(null);
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

  const handleCancel = () => {
    setQuestions([])
  }
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
    const data = {
      feedbackType,
      subType: feedbackType !== "event" ? subType : undefined,
      questions,
      ...(feedbackType === "event" && {
        feedbackId,
        resourcePerson,
        organization,
        note,
      }),
    };
    try {
      const response = await axios.post("/api/questions", data);
      console.log(response.data);
      setQuestions([]);
      setFeedbackId("");
      setResourcePerson("");
      setOrganization("");
      setNote("");
      fetchSavedQuestions();
      toast.success("Questions added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add questions");
    }
  };

  const handleDeleteQuestionSet = (questionSetId) => {
    setQuestionSetToDelete(questionSetId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (questionSetToDelete) {
      try {
        await axios.delete(`/api/questions?_id=${questionSetToDelete}`);
        fetchSavedQuestions();
        toast.success("Question set deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete question set");
      }
    }
    setIsDeleteModalOpen(false);
    setQuestionSetToDelete(null);
  };
  if (isDeleteModalOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Confirm Deletion</h2>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this question set? This action cannot be undone.
            </p>
            <Separator className="my-4" />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="px-4 py-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="container mx-auto my-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Questions Section */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Add Questions</CardTitle>
            <CardDescription>Please generate questions for feedback</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={feedbackType}
                  onValueChange={(value) => setFeedbackType(value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">External</SelectItem>
                  </SelectContent>
                </Select>

                {feedbackType === "academic" && (
                  <Select
                    value={subType}
                    onValueChange={(value) => setSubType(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theory">Theory</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {feedbackType === "event" && (
                <div className="space-y-2">
                  <Input
                    value={feedbackId}
                    onChange={(e) => setFeedbackId(e.target.value)}
                    placeholder="Feedback ID"
                    required
                  />
                  <Input
                    value={resourcePerson}
                    onChange={(e) => setResourcePerson(e.target.value)}
                    placeholder="Resource Person"
                    required
                  />
                  <Input
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Organization"
                    required
                  />
                    <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add Note"
                    required
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-grow"
                  placeholder="Enter question here"
                  required
                />
                <Button type="button" onClick={addQuestion}>Add</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={
                !feedbackType ||
                (feedbackType === "academic" && !subType) ||
                (feedbackType === "event" && (!feedbackId || !resourcePerson || !organization|| !note)) ||
                questions.length === 0
              }
            >
              Save
            </Button>
          </CardFooter>
        </Card>

        {/* Saved Questions Section */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Saved Questions</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            {savedQuestions && savedQuestions.length > 0 ? (
              savedQuestions.map((questionSet, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      {questionSet.feedbackType}{" "}
                      {questionSet.subType && `- ${questionSet.subType}`}
                    </h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleDeleteQuestionSet(questionSet._id)}
                    >
                      Delete Set
                    </Button>
                  </div>
                  {questionSet.feedbackType === "event" && (
                    <div className="mb-2 text-sm">
                      <p><strong>Feedback ID:</strong> {questionSet.feedbackId}</p>
                      <p><strong>Resource Person:</strong> {questionSet.resourcePerson}</p>
                      <p><strong>Organization:</strong> {questionSet.organization}</p>
                      <p><strong>Note:</strong> {questionSet.note}</p>
                    </div>
                  )}
                  {questionSet.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="mb-2">
                      <Textarea
                        value={question}
                        disabled
                        className="w-full text-sm"
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
      <Card>
        <CardHeader>
          <CardTitle>Added Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={index} className="mb-4 flex items-center">
                <Textarea
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="flex-grow mr-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeQuestion(index)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionForm;