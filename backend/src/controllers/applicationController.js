import Application from './../models/Application.js';
import catchAsyncError from './../utils/catchAsyncError.js';
import AppError from './../utils/AppError.js';

export const applyToJob = catchAsyncError(async (req, res, next) => {
  const job = req.job; // From param middleware
  const user = req.user; // from protect middleware
  const { coverLetter } = req.body;

  if (!coverLetter) {
    return next(new AppError(400, 'Please provide your cover letter'));
  }
  // Allow only freelancer to apply
  if (user.role !== 'freelancer') {
    return next(
      new AppError(403, 'Only freelancer are allowed to apply this job'),
    );
  }

  // Not apply to your owen job
  if (user._id.toString() === job.client.toString()) {
    return next(new AppError(400, 'You can not apply to your own job'));
  }

  const application = await Application.create({
    job: job._id,
    freelancer: user._id,
    coverLetter,
  });

  return res.status(201).json({
    success: true,
    message: 'Application applied',
    application,
  });
});

export const getJobApplication = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const job = req.job;

  if (user._id.toString() !== job.client.toString()) {
    return next(new AppError(403, 'You are not allowed to see applications'));
  }

  const applications = await Application.find({ job: job._id })
    .sort('-createdAt')
    .populate('freelancer', 'name email skills');

  res.status(200).json({
    success: true,
    result: applications.length,
    applications,
  });
});

export const getMyApplications = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const applications = await Application.find({ freelancer: user._id })
    .populate('job', 'title budget description')
    .sort('-create');

  res.status(200).json({
    success: true,
    result: applications.length,
    applications,
  });
});

export const updateApplicationStatus = catchAsyncError(
  async (req, res, next) => {
    const appId = req.params.appId;
    const user = req.user;
    const { status } = req.body;
    const allowedStatus = ['pending', 'accepted', 'rejected'];

    // check is valid status
    if (!allowedStatus.includes(status)) {
      return next(new AppError(400, 'Not allowed status'));
    }

    const application = await Application.findById(appId).populate('job'); //

    if (user._id.toString() !== application.job.client.toString()) {
      return next(
        new AppError(403, 'You do not have enough right for this action'),
      );
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      application,
    });
  },
);
