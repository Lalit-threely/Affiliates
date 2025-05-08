// logError function
export const logError = (err: Error): void => {
  console.error(err);
};

// logErrorMiddleware for handling errors in Express.js
import { Request, Response, NextFunction } from "express";

export const logErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logError(err);
  next(err);
};

// returnError function
export interface ErrorResponse {
  statusCode: number;
  response: {
    status: boolean;
    code: number;
    message: string;
    data?: string;
  };
}

export const returnError = (
  statusCode: number,
  message: string
): ErrorResponse => {
  return {
    statusCode,
    response: {
      status: false,
      code: statusCode,
      message,
    },
  };
};

// returnSuccess function
export interface SuccessResponse<T> {
  statusCode: number;
  response: {
    status: boolean;
    code: number;
    message: string;
    data: T;
  };
}

export const returnSuccess = <T>(
  statusCode: number,
  message: string,
  data: T = {} as T
): SuccessResponse<T> => {
  return {
    statusCode,
    response: {
      status: true,
      code: statusCode,
      message,
      data,
    },
  };
};

// getPaginationData function
export interface PaginationData<T> {
  totalItems: number;
  data: T[];
  totalPages: number;
  currentPage: number;
}

export const getPaginationData = <T>(
  rows: { count: number; rows: T[] },
  page: number = 0,
  limit: number
): PaginationData<T> => {
  const { count: totalItems, rows: data } = rows;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    data,
    totalPages,
    currentPage,
  };
};
