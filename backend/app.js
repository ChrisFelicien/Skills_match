import express from "express";
import AppError from "./src/utils/AppError.js";
import errorHandler from "./src/middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

//
app.use(/.*/, (req, res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} not found in this server `));
});

app.use(errorHandler);

export default app;
