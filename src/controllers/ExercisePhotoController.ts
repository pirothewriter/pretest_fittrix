import { Controller, Get, Query, Request, Route, Security, Tags } from 'tsoa';
import express from 'express';
import { ExercisePhotoResponse } from '../types/response/ExercisePhotoResponse';
import ExerciseService from '../adapters/service/ExerciseService';

@Route('exercise-photos')
@Tags('Exercise Photo')
export class ExercisePhotoController extends Controller {
  @Get('')
  @Security('jwt', ['MANAGER', 'USER'])
  public async getExercisePhotos(
    @Request() request: express.Request,
    @Query('') userIdx?: number
  ): Promise<ExercisePhotoResponse> {
    const authorizationToken = request.headers.authorization;
    const result = await ExerciseService().getExercisePhotos({
      authorizationToken,
      userIdx,
    });
    return result;
  }
}
