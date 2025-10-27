import { Response } from 'express';

interface ResponseData<T> {
  status: 'success';
  data: T;
  message?: string;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message?: string
): void => {
  const response: ResponseData<T> = {
    status: 'success',
    data,
  };
  if (message) {
    response.message = message;
  }
  res.status(statusCode).json(response);
};