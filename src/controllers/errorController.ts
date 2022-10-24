import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

/**
 * Sends error response in the development env
 * @param {AppError} err error object
 * @param {Request} req request object of Expess
 * @param {Response} res response object of Expess
 */
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    // console.log(err.isOperational);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // eslint-disable-next-line no-console
  return console.log(`ERROR`, err);
};

const handleTokenError = () =>
  new AppError('User is not authorised. Log in again', 401);

const handleTokenExpiredError = () =>
  new AppError('User is not authorised. Token Expired. Log in again', 401);

/**
 * Send Error response while in prod env
 * @description Contains to blocks of code, first block
 * represents the operational errors, the second blocks deals
 * with the programming error
 * @param {AppError} err the complete error object
 * @param {Response} res the response object of Express
 * @returns void
 * @example
 * sendErrorProd(err, req, res);
 */
const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, Trusted error : send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming error, where we dont want to leak info
    }
    // 1) log to console
    // eslint-disable-next-line no-console
    console.error(`ERROR`, err);
    // 2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }

  if (err.isOperational) {
    // Programming error, where we dont want to leak info
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'JsonWebTokenError') error = handleTokenError();

    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(error, req, res);
  }
};
