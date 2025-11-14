import express from 'express';
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe,
  updateUserPassword,
} from './../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-account', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.post('/change-password', protect, updateUserPassword);
router.get('/me', protect, getMe);

export default router;
