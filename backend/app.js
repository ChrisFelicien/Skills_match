import morgan from 'morgan';
import express, { application } from 'express';
import cookieParser from 'cookie-parser';
import AppError from './src/utils/AppError.js';
import errorHandler from './src/middleware/errorMiddleware.js';
import authRoutes from './src/routes/authRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import applicationRoutes from './src/routes/applicationRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

//
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use(/.*/, (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found in this server `));
});

app.use(errorHandler);

export default app;
