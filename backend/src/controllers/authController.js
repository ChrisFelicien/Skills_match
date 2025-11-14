import User from './../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsyncError from '../utils/catchAsyncError.js';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generatorToken.js';

const cookiesOptions = {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'Strict',
  // 7 days
};

const accessTokenOption = {
  ...cookiesOptions,
  maxAge: 15 * 60 * 1000,
};

const refreshTokenOption = {
  ...cookiesOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

  res.cookie('refreshToken', refreshToken, refreshTokenOption);

  res.cookie('accessToken', accessToken, accessTokenOption);

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

  res.cookie('refreshToken', refreshToken, refreshTokenOption);
  res.cookie('accessToken', accessToken, accessTokenOption);

  user.password = undefined;
  user.refreshToken = undefined;
  res.status(200).json({
    success: true,
    accessToken,
    user,
  });
});

export const logoutUser = async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const user = await User.findOne({ refreshToken: token });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.status(200).json({
    success: true,
    message: 'Disconnected',
  });
};

export const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new AppError(401, 'No refresh token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      return next(new AppError(401, 'Refresh token invalid'));
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, accessTokenOption);
    res.cookie('refreshToken', refreshToken, refreshTokenOption);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken });
  } catch (error) {
    next(new AppError(401, 'Invalid token provided'));
  }
};

export const getMe = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  user.password = undefined;
  user.refreshToken = undefined;
  return res.status(200).json({
    success: true,
    message: 'User profile',
    user,
  });
});

export const updateUserPassword = catchAsyncError(async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;

  if (!password || !newPassword || !confirmPassword) {
    return next(
      new AppError(
        400,
        'Please provide the current password, the new password and confirm password',
      ),
    );
  }

  if (password === newPassword) {
    return next(
      new AppError(
        400,
        'You can not user the current password has your new password',
      ),
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new AppError(
        400,
        'The new password and the confirm password should match',
      ),
    );
  }

  const user = req.user;

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError(400, 'Please provide the correct password'));
  }
  user.password = newPassword;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, refreshTokenOption);
  res.cookie('accessToken', accessToken, accessTokenOption);

  user.password = undefined;
  user.refreshToken = undefined;

  return res.status(201).json({
    success: true,
    user,
    accessToken,
  });
});
