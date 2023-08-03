import {
  Tags,
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
} from 'tsoa';
import { LoginRequest } from '../types/requests/LoginRequest';
import AuthorizationService from '../adapters/service/AuthorizationService';
import { LoginResponse } from '../types/response/LoginResponse';
import { SignupRequest } from '../types/requests/SignupRequest';
import { UserResponse } from '../types/response/UserResponse';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config/jwtConfig';
import { NOT_FOUND } from '../types/exceptions/CommonExceptions';
import { UNAUTORIZED } from '../types/exceptions/AuthorizationExceptions';
import express from 'express';

@Route('users')
@Tags('Auth')
export class UsersController extends Controller {
  @Post('/login')
  public async login(
    @Body() requestBody: LoginRequest
  ): Promise<LoginResponse> {
    const response = await AuthorizationService().login(requestBody);
    return response;
  }

  @Post('/signup')
  public async signup(@Body() signupRequest: SignupRequest): Promise<boolean> {
    const response = await AuthorizationService().signup(signupRequest);
    return response;
  }

  @Get('/my')
  @Security('jwt', ['MANAGER', 'USER'])
  public async getMyInfo(
    @Request() request: express.Request
  ): Promise<UserResponse> {
    const authorizationToken = request.headers.authorization;
    if (!authorizationToken) {
      throw UNAUTORIZED;
    }
    const decoded: any = jwt.verify(
      authorizationToken.replace('Bearer ', ''),
      secretKey
    );

    if (!decoded.userIdx) {
      throw NOT_FOUND;
    }

    const response = await AuthorizationService().getUserByIdx(
      Number(decoded.userIdx)
    );
    return response;
  }
}
