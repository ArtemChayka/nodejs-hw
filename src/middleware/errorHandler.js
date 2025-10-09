import { isHttpError } from 'http-errors';
import { isCelebrateError } from 'celebrate';

export const errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorMessages = [];

    err.details.forEach((detail) => {
      detail.details.forEach((error) => {
        errorMessages.push(error.message);
      });
    });

    return res.status(400).json({
      message: errorMessages.join(', '),
    });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: err.message || 'Something went wrong',
  });
};
