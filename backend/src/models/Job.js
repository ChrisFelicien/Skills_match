import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job must have a title'],
      time: true,
    },
    description: {
      type: String,
      required: [true, 'Job must have a description'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Job must have a budget'],
    },
    skills: {
      type: [String],
      required: [true, 'Please provide at least one required skills'],
    },
    status: {
      type: String,
      enum: ['open', 'close'],
      default: 'open',
    },
    client: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Job', JobSchema);
