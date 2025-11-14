import Job from './../models/Job.js';
import catchAsyncError from './../utils/catchAsyncError.js';
import AppError from './../utils/AppError.js';
import validator from 'validator';

export const checkIdAndFindJob = async (req, res, next) => {
  const jobId = req.params.jobId;
  if (!validator.isMongoId(jobId)) {
    return next(new AppError(400, 'Please provide valid mongo id'));
  }
  const job = await Job.findById(jobId);

  if (!job) {
    return next(new AppError(404, 'No job found with this id'));
  }
  req.job = job;
  return next();
};

export const checkRightAccess = (req, res, next) => {
  const user = req.user;
  const job = req.job;

  if (!user._id.equals(job.client)) {
    return next(
      new AppError(403, 'You are not allowed to perform this action'),
    );
  }

  next();
};

export const createJob = catchAsyncError(async (req, res, next) => {
  const { title, description, budget, skills } = req.body;

  if (!title || !description || !budget || !skills) {
    return next(new AppError(400, 'All fields are required'));
  }

  const job = await Job.create({
    title,
    description,
    budget,
    skills,
    client: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: `Create new job`,
    job,
  });
});

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find().sort('-createdAt');
  res.status(200).json({
    success: true,
    result: jobs.length,
    jobs,
  });
});

export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ client: req.user._id });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const allowed = ['title', 'description', 'budget', 'skills'];
  const filteredData = {};

  Object.keys(req.body).forEach((key) => {
    if (allowed.includes(key)) filteredData[key] = req.body[key];
  });

  const job = await Job.findByIdAndUpdate(req.job._id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    job,
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  await Job.findByIdAndDelete(req.job._id);
  res.status(200).end();
});

export const getJob = catchAsyncError(async (req, res, next) => {
  const job = req.job;
  res.status(200).json({
    success: true,
    job,
  });
});
