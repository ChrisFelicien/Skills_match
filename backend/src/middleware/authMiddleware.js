import jwt from 'jsonwebtoken';
import User from './../models/User.js';
import AppError from './../utils/AppError.js';

export const protect = async (req, res, next) => {
  let token;
  const headers = req.headers;
  if (headers.authorization && headers.authorization.startsWith('Bearer ')) {
    token = headers.authorization.split(' ')[1];
  } else {
    return next(new AppError(401, 'No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select('+password');

    if (!user) {
      return next(new AppError(404, 'Look like the user is no longer exist'));
    }

    const passwordBeenChanged = user.passwordBeenChanged(decoded.iat);

    if (passwordBeenChanged) {
      return next(
        new AppError(
          401,
          'Look like your password was been update please login again',
        ),
      );
    }
    req.user = user;

    next();
  } catch (error) {
    return next(new AppError(400, error));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!roles.includes(user.role)) {
      return next(
        new AppError(
          403,
          'Forbidden, You are not allowed to perform this action',
        ),
      );
    }

    next();
  };
};
