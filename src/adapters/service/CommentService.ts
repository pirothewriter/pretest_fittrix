import { UNAUTORIZED } from '../../types/exceptions/AuthorizationExceptions';
import jwt from 'jsonwebtoken';
import { secretKey } from '../../config/jwtConfig';
import ExerciseCommentRepository from '../repository/ExerciseCommentRepository';
import ExercisePostRepository from '../repository/ExercisePostRepository';
import { NOT_FOUND } from '../../types/exceptions/CommonExceptions';
import { CommentsResponse } from '../../types/response/CommentsResponse';

const CommentService = () => {
  const addComment = async ({
    authorizationToken,
    exercisePostIdx,
    comment,
  }: {
    authorizationToken: string | undefined;
    exercisePostIdx: number;
    comment: string;
  }) => {
    if (!authorizationToken) {
      throw UNAUTORIZED;
    }

    const decoded: any = jwt.verify(
      authorizationToken.replace('Bearer ', ''),
      secretKey
    );

    const userIdx = Number.parseInt(decoded.userIdx as string);

    const posts = await ExercisePostRepository().getExercisePostByIdx(
      exercisePostIdx
    );
    if (posts.length === 0) {
      throw NOT_FOUND;
    }

    await ExerciseCommentRepository().insertComment({
      userIdx: userIdx,
      comment: comment,
      commentDt: new Date(),
      exercisePostIdx: exercisePostIdx,
    });
    return true;
  };

  const getCommentsByExercisePostIdx = async (
    exercisePostIdx: number
  ): Promise<CommentsResponse> => {
    const posts = await ExercisePostRepository().getExercisePostByIdx(
      exercisePostIdx
    );
    if (posts.length === 0) {
      throw NOT_FOUND;
    }

    const dbResult: any =
      await ExerciseCommentRepository().getCommentWithUserByExercisePostIdx(
        exercisePostIdx
      );

    if (dbResult.length === 0) {
      return {
        comments: [],
        count: 0,
      };
    }

    const result = dbResult.map((row: any) => {
      return {
        user: {
          userIdx: row.user_idx,
          user_id: row.user_id,
          userPermission: row.user_permission,
        },
        comment: row.comment,
        commentDt: row.comment_dt,
      };
    });

    return {
      comments: result,
      count: result.length,
    };
  };

  return {
    addComment,
    getCommentsByExercisePostIdx,
  };
};
export default CommentService;
