import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const departmentSchema = new Schema(
  {
   
    department: {
      type: String,
      required: true,
      enum: ['CSE', 'First Year', 'ENTC', 'Electrial', 'Civil', 'Mechanical'], // Replace with your department options
    },
    classes:[],
    _id: {
        type: String,
      },
    password: 
      {
        type: String,
        required: true,
      }
    ,
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Department = mongoose.models.Department || model('Department', departmentSchema);

export default Department;
