import { ExercisePostRequest } from '../types/requests/ExercisePostRequest';
import { NOT_FILL_FIELD } from '../types/exceptions/ExerciseExceptions';
import ExercisePostRepository from '../repository/ExercisePostRepository';
import exercisePostRepository from '../repository/ExercisePostRepository';
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../types/exceptions/CommonExceptions';
import ExercisePhotoRepository from '../repository/ExercisePhotoRepository';
import { OrderType } from '../types/enums/OrderType';
import { ExercisePostResponse } from '../types/response/ExercisePostResponse';
import { ExerciseType } from '../types/enums/ExerciseType';
import { UNAUTORIZED } from '../types/exceptions/AuthorizationExceptions';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config/jwtConfig';
import { UserPermission } from '../types/enums/UserPermission';
import {
  ExercisePhotoResponse,
  ExercisePhotos,
} from '../types/response/ExercisePhotoResponse';

const ExerciseService = () => {
  const addExercisePost = async ({
    authorizationToken,
    exercisePostRequest: exercisePostRequest,
  }: {
    authorizationToken: string | undefined;
    exercisePostRequest: ExercisePostRequest;
  }): Promise<boolean> => {
    if (!authorizationToken) {
      throw UNAUTORIZED;
    }

    const decoded: any = jwt.verify(
      authorizationToken.replace('Bearer ', ''),
      secretKey
    );

    const userIdx = Number.parseInt(decoded.userIdx as string);

    if (
      exercisePostRequest.title === '' ||
      exercisePostRequest.contents === ''
    ) {
      throw NOT_FILL_FIELD;
    }

    const postDt = new Date();
    const post = await ExercisePostRepository().insertExercisePost({
      userIdx: userIdx,
      title: exercisePostRequest.title,
      contents: exercisePostRequest.contents,
      postDt: postDt,
      exerciseTp: exercisePostRequest.exerciseType,
    });

    if (!post) {
      throw INTERNAL_SERVER_ERROR;
    }

    const postIndex = post.exercise_post_idx;
    await ExercisePhotoRepository().insertPhotos({
      exercisePostIdx: postIndex,
      photos: exercisePostRequest.photoUrls,
    });
    return true;
  };

  const getExercisePosts = async ({
    uploadOrderType,
    page,
    size,
    commentOrderType,
    exerciseType,
  }: {
    uploadOrderType: OrderType;
    page: number;
    size: number;
    commentOrderType?: OrderType;
    exerciseType?: ExerciseType;
  }): Promise<ExercisePostResponse> => {
    const dbResult: any = await ExercisePostRepository().getExercisePosts({
      uploadOrderType,
      exerciseType,
      offset: (page - 1) * size,
      size,
      commentOrderType,
    });

    const targetExercisePostInx: number[] = [];
    dbResult.forEach((row: any) => {
      targetExercisePostInx.push(row.exercise_post_idx);
    });

    const photos = await ExercisePhotoRepository().getPhotosByExercisePostIdx({
      exercisePostIdxs: targetExercisePostInx,
    });
    const photoMap: Map<number, string[]> = new Map<number, string[]>();
    photos.forEach((photo) => {
      let photosByExercisePostIdx = photoMap.get(photo.exercise_post_idx);
      if (!photosByExercisePostIdx) {
        photosByExercisePostIdx = [];
      }

      photosByExercisePostIdx.push(photo.photo_url);
      photoMap.set(photo.exercise_post_idx, photosByExercisePostIdx);
    });

    const data = dbResult.map((row: any) => {
      return {
        user: {
          userIdx: row.user_idx,
          userId: row.user_id,
          userPermission: row.user_permission,
        },
        exercisePostIdx: row.exercise_post_idx,
        title: row.title,
        contents: row.contents,
        exerciseTp: row.exercise_tp,
        postDt: row.post_dt,
        photos: photoMap.get(row.exercise_post_idx),
      };
    });

    const totalCnt = await ExercisePostRepository().getPostCount({
      exerciseType,
    });
    return {
      data: data,
      page: page,
      postPerPage: size,
      totalPage: Math.ceil(totalCnt / size),
    };
  };

  const getExercisePostByIndex = async (exercisePostIdx: number) => {
    const dbResult = await ExercisePostRepository().getExercisePostByIdx(
      exercisePostIdx
    );
    if (dbResult.length === 0) {
      throw NOT_FOUND;
    }

    const photos = await ExercisePhotoRepository().getPhotosByExercisePostIdx({
      exercisePostIdxs: [exercisePostIdx],
    });

    return {
      user: {
        userIdx: dbResult[0].user_idx,
        userId: dbResult[0].user_id,
        userPermission: dbResult[0].user_permission,
      },
      exercisePostIdx: dbResult[0].exercise_post_idx,
      title: dbResult[0].title,
      contents: dbResult[0].contents,
      exerciseTp: dbResult[0].exercise_tp,
      postDt: dbResult[0].post_dt,
      photos: photos.map((photo) => {
        return photo.photo_url;
      }),
    };
  };

  const updateExercisePost = async ({
    authorizationToken,
    exercisePostIdx,
    exercisePostRequest,
  }: {
    authorizationToken: string | undefined;
    exercisePostIdx: number;
    exercisePostRequest: ExercisePostRequest;
  }) => {
    if (!authorizationToken) {
      throw UNAUTORIZED;
    }
    const dbResult = await exercisePostRepository().getExercisePostByIdx(
      exercisePostIdx
    );
    if (!dbResult || dbResult.length === 0) {
      throw NOT_FOUND;
    }

    const post = dbResult[0];
    const decoded: any = jwt.verify(
      authorizationToken.replace('Bearer ', ''),
      secretKey
    );

    const userIdx = Number.parseInt(decoded.userIdx as string);
    if (decoded.permission === UserPermission.USER) {
      if (post.user_idx !== userIdx) {
        throw FORBIDDEN;
      }
    }

    await ExercisePostRepository().updatePost({
      exercisePostIdx: exercisePostIdx,
      updateUserIdx: userIdx,
      updateDt: new Date(),
      contents: exercisePostRequest.contents,
      exerciseTp: exercisePostRequest.exerciseType,
      title: exercisePostRequest.title,
    });
    await ExercisePhotoRepository().deleteExercisePhotosByExercisePostIdx(
      exercisePostIdx
    );
    await ExercisePhotoRepository().insertPhotos({
      exercisePostIdx: exercisePostIdx,
      photos: exercisePostRequest.photoUrls,
    });
    return true;
  };

  const deleteExercisePost = async (exercisePostIdx: number) => {
    const dbResult = await exercisePostRepository().deleteExercisePost(
      exercisePostIdx
    );
    if (!dbResult) {
      throw NOT_FOUND;
    }
    await ExercisePhotoRepository().deleteExercisePhotosByExercisePostIdx(
      exercisePostIdx
    );
    return true;
  };

  const getExercisePhotos = async ({
    authorizationToken,
    userIdx,
  }: {
    authorizationToken: string | undefined;
    userIdx?: number;
  }): Promise<ExercisePhotoResponse> => {
    if (!authorizationToken) {
      throw UNAUTORIZED;
    }

    let targetUserIdx = userIdx;
    if (!userIdx) {
      const decoded: any = jwt.verify(
        authorizationToken.replace('Bearer ', ''),
        secretKey
      );

      targetUserIdx = Number.parseInt(decoded.userIdx as string);
    }

    if (!targetUserIdx) {
      throw NOT_FOUND;
    }
    const exercises = await ExercisePostRepository().getExercisePostsByUserIdx(
      targetUserIdx
    );

    const targetExercisePostInx: number[] = [];
    exercises.forEach((row: any) => {
      targetExercisePostInx.push(row.exercise_post_idx);
    });

    const photos = await ExercisePhotoRepository().getPhotosByExercisePostIdx({
      exercisePostIdxs: targetExercisePostInx,
    });
    const photoMap: Map<number, string[]> = new Map<number, string[]>();
    photos.forEach((photo) => {
      let photosByExercisePostIdx = photoMap.get(photo.exercise_post_idx);
      if (!photosByExercisePostIdx) {
        photosByExercisePostIdx = [];
      }

      photosByExercisePostIdx.push(photo.photo_url);
      photoMap.set(photo.exercise_post_idx, photosByExercisePostIdx);
    });

    const photoResult: ExercisePhotos[] = [];
    for (let index = 0, size = exercises.length; index < size; index += 1) {
      photoResult.push({
        postDt: exercises[index].post_dt,
        hasPrevius: index !== 0,
        hasNext: index + 1 < size,
        photoUrls: photoMap.get(exercises[index].exercise_post_idx) ?? [],
      });
    }

    return {
      exercisePhotos: photoResult,
    };
  };

  return {
    addExercisePost,
    getExercisePosts,
    getExercisePostByIndex,
    updateExercisePost,
    deleteExercisePost,
    getExercisePhotos,
  };
};
export default ExerciseService;
