import User from './../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generatorToken.js';

export const signupUser = catchAsyncError(async (req, res, next) => {
  const { name, lastName, email, password } = req.body;

  if (!name || !lastName || !email || !password) {
    return next(new AppError(400, 'All fields are required'));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError(400, 'User with this email already exist'));
  }

  const user = await User.create({ name, lastName, email, password });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();
  // send refreshToken in cookie only

  res.cookie('refreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('accessToken', accessToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000,
  });

  user.password = undefined;
  user.refreshToken = undefined;

  res.status(201).json({
    success: true,
    accessToken,
    user,
  });
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(400, 'Please provide your email and your password'),
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError(401, 'Invalid credential'));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', accessToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000,
  });

  user.password = undefined;
  user.refreshToken = undefined;
  res.status(201).json({
    success: true,
    accessToken,
    user,
  });
});

export const logoutUser = (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'logout user',
  });
};

export const refreshToken = (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Refresh token',
  });
};
