import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionsSchema = new Schema(
  {
    feedbackType: {
      type: String,
      required: true,
      enum: ['academic', 'event']
    },
    subType: {
      type: String,
      required: function() { return this.feedbackType === 'academic'; },
      enum: ['theory', 'practical']
    },
    feedbackId: {
      type: String,
      
    },
    resourcePerson: {
      type: String,
      
    },
    organization: {
      type: String,
      
    },
    note: {
      type: String,
      
    },
    questions: [
      {
        type: String,
        required: true,
      }
    ],
  },
  {
    timestamps: true, 
  }
);

const Questions = mongoose.models.Questions || model('Questions', questionsSchema);

export default Questions;