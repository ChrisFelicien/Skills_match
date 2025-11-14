import express from 'express';
import {
  createJob,
  getAllJobs,
  getJob,
  deleteJob,
  updateJob,
  getMyJobs,
  checkIdAndFindJob,
  checkRightAccess,
} from '../controllers/jobController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.param('jobId', checkIdAndFindJob);

router
  .route('/')
  .get(getAllJobs)
  .post(protect, restrictTo('client', 'admin'), createJob);
router
  .route('/:jobId')
  .get(getJob)
  .patch(protect, checkRightAccess, updateJob)
  .delete(protect, checkRightAccess, deleteJob);

router.get('/my-jobs', protect, getMyJobs);

export default router;
