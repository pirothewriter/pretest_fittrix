import { FittrixError } from './FittrixError';

export const BAD_REQUEST: FittrixError = {
  message: 'Bad Request',
  statusCode: 400,
  name: 'Bad Request',
};

export const FORBIDDEN: FittrixError = {
  message: 'Forbidden',
  statusCode: 403,
  name: 'Forbidden',
};

export const NOT_FOUND: FittrixError = {
  message: 'Not Found',
  statusCode: 404,
  name: 'Not Found',
};

export const INTERNAL_SERVER_ERROR: FittrixError = {
  message: 'Internal Server Error',
  statusCode: 500,
  name: 'Internal Server Error',
};
