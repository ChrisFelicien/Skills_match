import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must belong to a job'],
    },
    freelancer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must belong to a freelancer'],
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['accepted', 'pending', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

ApplicationSchema.index({ freelancer: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', ApplicationSchema);
