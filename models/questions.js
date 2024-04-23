import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionsSchema = new Schema(
  {
    feedbackType: {
      type: String,
      required: true,
    },
    subType: {
        type: String
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
