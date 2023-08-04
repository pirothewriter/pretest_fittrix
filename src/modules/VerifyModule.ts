import express from 'express';
import { UNAUTORIZED } from '../types/exceptions/AuthorizationExceptions';
import AuthorizationService from '../service/AuthorizationService';

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const token = request.headers.authorization;

      if (!token) {
        throw UNAUTORIZED;
      }

      const result = await AuthorizationService().verified(
        token as string,
        scopes
      );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
