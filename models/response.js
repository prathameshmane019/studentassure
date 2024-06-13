import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const responseSchema = new Schema({
    feedback_id: {
        type: String,  // Reference to the Feedback model
        required: true,
      },
    ratings: [{
        subject_id: String,
        suggestions: String,
        ratings: []
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const Response = mongoose.models.Response || model('Response', responseSchema);

export default Response;
