import { FittrixError } from './FittrixError';

export const UNAUTORIZED: FittrixError = {
  message: 'Unautorized',
  statusCode: 401,
  name: 'Unautorized',
};

export const TOKEN_EXPIRED: FittrixError = {
  message: 'TOKEN EXPIRED',
  statusCode: 401,
  name: 'Unautorized',
};

export const ID_DUPLICATED: FittrixError = {
  message: 'ID Duplicated',
  statusCode: 409,
  name: 'Conflict',
};

export const NOT_VALID_SIGNUP_FORM: FittrixError = {
  message: 'NOT VALID SIGNUP FORM',
  statusCode: 400,
  name: 'Bad Request',
};
