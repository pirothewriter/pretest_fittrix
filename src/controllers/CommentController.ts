import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import express from 'express';
import { CommentRequest } from '../types/requests/CommentRequest';
import CommentService from '../service/CommentService';
import { CommentsResponse } from '../types/response/CommentsResponse';

@Route('')
@Tags('Comment')
export class CommentController extends Controller {
  @Post('/exercises/{exercisePostIdx}/comments')
  @Security('jwt', ['MANAGER', 'USER'])
  public async addComment(
    @Request() request: express.Request,
      @Path() exercisePostIdx: number,
      @Body() commentRequest: CommentRequest
  ): Promise<boolean> {
    const authorizationToken = request.headers.authorization;
    const result = await CommentService().addComment({
      authorizationToken,
      exercisePostIdx: exercisePostIdx,
      comment: commentRequest.comment,
    });
    return result;
  }

  @Get('/exercises/{exercisePostIdx}/comments')
  @Security('jwt', ['MANAGER', 'USER'])
  public async getComments(
    @Path() exercisePostIdx: number
  ): Promise<CommentsResponse> {
    const result = await CommentService().getCommentsByExercisePostIdx(
      exercisePostIdx
    );
    return result;
  }
}
