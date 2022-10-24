import cors from 'cors';
import express, { NextFunction } from 'express';
import morgan from 'morgan';
import globalErrorHandler from './controllers/errorController';
import AppError from './utils/appError';
const app = express();

// Basic cors setup * allow all
app.use(cors());
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => {
  res.send('Hello world!');
});

// Will show 404 if no route found
app.use('*', (_req, _res, next: NextFunction) => {
  return next(new AppError('Not Found', 404));
});

app.use(globalErrorHandler);

export default app;
