import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import { ExercisePostRequest } from '../types/requests/ExercisePostRequest';
import ExerciseService from '../adapters/service/ExerciseService';
import { OrderType } from '../types/enums/OrderType';
import { ExerciseType } from '../types/enums/ExerciseType';
import {
  ExercisePost,
  ExercisePostResponse,
} from '../types/response/ExercisePostResponse';
import express from 'express';
import jwt from 'jsonwebtoken';

@Route('exercises')
@Tags('Exercise')
export class ExerciseController extends Controller {
  @Post('')
  @Security('jwt', ['MANAGER', 'USER'])
  public async addExercisePost(
    @Request() request: express.Request,
      @Body() exercisePostRequest: ExercisePostRequest
  ): Promise<boolean> {
    const authorizationToken = request.headers.authorization;
    const result = await ExerciseService().addExercisePost({
      authorizationToken,
      exercisePostRequest,
    });
    return true;
  }

  @Get('')
  @Security('jwt', ['MANAGER', 'USER'])
  public async getExercisePosts(
    @Query('') uploadOrderType: OrderType = OrderType.DESC,
    @Query('') page: number = 1,
    @Query('') size: number = 20,
    @Query('') commentOrderType?: OrderType,
    @Query('') exerciseType?: ExerciseType
  ): Promise<ExercisePostResponse> {
    const result = await ExerciseService().getExercisePosts({
      uploadOrderType: uploadOrderType,
      page: page,
      size: size,
      commentOrderType: commentOrderType,
      exerciseType: exerciseType,
    });

    return result;
  }

  @Get('/{exercisePostIdx}')
  @Security('jwt', ['MANAGER', 'USER'])
  public async getExcercisePostByIndex(
    @Path() exercisePostIdx: number
  ): Promise<ExercisePost> {
    const result = await ExerciseService().getExercisePostByIndex(
      exercisePostIdx
    );
    return result;
  }

  @Put('/{exercisePostIdx}')
  @Security('jwt', ['MANAGER', 'USER'])
  public async updateExercisePost(
    @Path() exercisePostIdx: number,
      @Request() request: express.Request,
      @Body() exercisePostRequest: ExercisePostRequest
  ): Promise<boolean> {
    const authorizationToken = request.headers.authorization;
    const result = await ExerciseService().updateExercisePost({
      authorizationToken,
      exercisePostIdx,
      exercisePostRequest,
    });
    return result;
  }

  @Delete('/{exercisePostIdx}')
  @Security('jwt', ['MANAGER'])
  public async deleteExercisePost(
    @Path() exercisePostIdx: number
  ): Promise<boolean> {
    const result = await ExerciseService().deleteExercisePost(exercisePostIdx);
    return result;
  }
}
