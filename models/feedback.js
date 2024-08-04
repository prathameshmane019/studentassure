import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const feedbackSchema = new Schema(
  {
    feedbackTitle: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    feedbackType: {
      type: String
    },
    subjects: [
      {
        _id: {
          type: String,
        },
        subject: {
          type: String,
        },
        faculty: {
          type: String,
        },
      },
    ],
    questions: [
       {
          type: String,
          required: true,
       }
    ],
    responses: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Response'
    },
    students: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
    },
    class: {
      type: String,
    },

    pwd: {
      type: String,
      required: true,
    },
    resourcePerson: {
      type: String,
      
    },
    organization: {
      type: String,
      
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Feedback = mongoose.models.Feedback || model('Feedback', feedbackSchema);

export default Feedback;
