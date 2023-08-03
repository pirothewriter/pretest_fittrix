import { Secret, SignOptions } from 'jsonwebtoken';

export const secretKey: Secret = 'FittrixPreTest';
export const options: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '60m',
  issuer: 'fittrix',
};
