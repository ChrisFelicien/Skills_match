import express from 'express';
import {
  applyToJob,
  getJobApplication,
  getMyApplications,
  updateApplicationStatus,
} from './../controllers/applicationController.js';

import { protect, restrictTo } from './../middleware/authMiddleware.js';
import { checkIdAndFindJob } from '../controllers/jobController.js';

const router = express.Router();

router.post(
  '/jobs/:jobId/apply',
  protect,
  checkIdAndFindJob,
  restrictTo('freelancer'),
  applyToJob,
);

router.get(
  '/jobs/:jobId/applications',
  protect,
  checkIdAndFindJob,
  restrictTo('client'),
  getJobApplication,
);

router.get('/me', protect, restrictTo('freelancer'), getMyApplications);
router.patch(
  '/:appId/status',
  protect,
  restrictTo('client'),
  updateApplicationStatus,
);

export default router;
