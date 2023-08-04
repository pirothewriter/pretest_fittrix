import { LoginRequest } from '../types/requests/LoginRequest';
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../types/exceptions/CommonExceptions';
import { LoginResponse } from '../types/response/LoginResponse';
import UserRepository from '../repository/UserRepository';
import {
  ID_DUPLICATED,
  NOT_VALID_SIGNUP_FORM,
  TOKEN_EXPIRED,
  UNAUTORIZED,
} from '../types/exceptions/AuthorizationExceptions';
import jwt from 'jsonwebtoken';
import { options, secretKey } from '../config/jwtConfig';
import LoginRepository from '../repository/LoginRepository';
import { SignupRequest } from '../types/requests/SignupRequest';
import { UserResponse } from '../types/response/UserResponse';
import { UserPermission } from '../types/enums/UserPermission';

const AuthorizationService = () => {
  const login = async ({
    id,
    password,
  }: LoginRequest): Promise<LoginResponse> => {
    if (!id || !password || id === '' || password === '') {
      throw BAD_REQUEST;
    }

    const user = await UserRepository().getUserByIdAndPassword(id, password);
    if (!user) {
      throw UNAUTORIZED;
    }

    const expireDt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14);
    const payload = {
      userIdx: user.userIdx,
      id: user.userId,
      permission: user.userPermission,
      expireDt: expireDt.getTime(),
    };

    try {
      const result = {
        authorizedToken: jwt.sign(payload, secretKey, options),
        refreshToken: jwt.sign({}, secretKey, {
          algorithm: 'HS256',
          expiresIn: '14d',
        }),
      };
      await LoginRepository().deleteLoginInfo(user.userIdx);
      await LoginRepository().insertLoginInfo({
        userIndex: user.userIdx,
        authorizedToken: result.authorizedToken,
        refreshToken: result.refreshToken,
        loginDt: new Date(),
        expireDt: expireDt,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw UNAUTORIZED;
    }
  };

  const verified = (authorizedToken: string, scopes?: string[]) => {
    let decoded: any;
    try {
      decoded = jwt.verify(authorizedToken.replace('Bearer ', ''), secretKey);
    } catch (error) {
      throw UNAUTORIZED;
    }

    if (new Date().getTime() > decoded.expireDt) {
      throw TOKEN_EXPIRED;
    }

    if (scopes && scopes.length > 0 && decoded.permission !== undefined) {
      const userPermission: UserPermission = decoded.permission;
      const permissionScopes: number[] = scopes.map((scope) => {
        if (scope === 'MANAGER') {
          return 0;
        } else {
          return 1;
        }
      });
      if (permissionScopes.indexOf(userPermission) === -1) {
        throw FORBIDDEN;
      }
    }

    return decoded;
  };

  const getUserIdxFromToken = (authorizationToken: string): number => {
    const decoded: any = jwt.verify(
      authorizationToken.replace('Bearer ', ''),
      secretKey
    );
    if (decoded.userIdx) {
      return Number.parseInt(decoded.userIdx as string);
    } else {
      return 0;
    }
  };

  const signup = async ({
    id,
    password,
    passwordConfirm,
    permission,
  }: SignupRequest): Promise<boolean> => {
    if (password !== passwordConfirm) {
      throw NOT_VALID_SIGNUP_FORM;
    }

    const alreadySignuped = await UserRepository().getUserById(id);
    if (alreadySignuped) {
      throw ID_DUPLICATED;
    }

    const result = await UserRepository().insertUser({
      id: id,
      password: passwordConfirm,
      userPermission: permission,
    });
    if (!result) {
      throw INTERNAL_SERVER_ERROR;
    }

    return true;
  };

  const getUserByIdx = async (userIdx: number): Promise<UserResponse> => {
    const dbResult = await UserRepository().getUserByIdx(userIdx);
    if (!dbResult) {
      throw NOT_FOUND;
    }
    return {
      userIdx: dbResult.user_idx,
      userId: dbResult.user_id,
      userPermission: dbResult.user_permission,
    };
  };

  return {
    login,
    getUserIdxFromToken,
    verified,
    signup,
    getUserByIdx,
  };
};
export default AuthorizationService;
