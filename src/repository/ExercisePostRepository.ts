import { ExerciseType } from '../types/enums/ExerciseType';
import { OrderType } from '../types/enums/OrderType';
import DbConnectionStore from '../intrastructure/DbConnectionStore';
import { UserPermission } from '../types/enums/UserPermission';

const ExercisePostRepository = () => {
  const insertExercisePost = async ({
    userIdx,
    exerciseTp,
    title,
    contents,
    postDt,
  }: {
    userIdx: number;
    exerciseTp: ExerciseType;
    title: string;
    contents: string;
    postDt: Date;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.exercise_posts.create({
      data: {
        user_idx: userIdx,
        exercise_tp: exerciseTp,
        title: title,
        contents: contents,
        post_dt: postDt,
        update_user_idx: exerciseTp,
        update_dt: postDt,
      },
    });
    return result;
  };

  const getExercisePosts = async ({
    uploadOrderType,
    offset,
    size,
    commentOrderType,
    exerciseType,
  }: {
    uploadOrderType: OrderType;
    offset: number;
    size: number;
    commentOrderType?: OrderType;
    exerciseType?: ExerciseType;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    let query = `SELECT EP.exercise_post_idx,
                            EP.exercise_tp,
                            EP.title,
                            EP.contents,
                            EP.post_dt,
                            U.user_id,
                            U.user_idx,
                            U.user_permission
                     FROM exercise_posts EP
                              JOIN users U ON U.user_idx = EP.user_idx`;

    if (commentOrderType) {
      query += ` LEFT JOIN exercise_comments EC ON EC.exercise_post_idx = EP.exercise_post_idx`;
    }

    if (exerciseType) {
      query += ` WHERE EP.exercise_tp=${exerciseType}`;
    }

    query += ` ORDER BY`;

    if (commentOrderType) {
      query += ` EC.comment_dt ${commentOrderType},`;
    }

    query += ` EP.post_dt ${uploadOrderType}`;

    query += ` LIMIT ${offset}, ${size}`;

    const result = await dbClient.$queryRawUnsafe(query);
    return result;
  };

  const getPostCount = async ({
    exerciseType,
  }: {
    exerciseType?: ExerciseType;
  }): Promise<number> => {
    const dbClient = DbConnectionStore.getInstance();
    if (exerciseType) {
      const result = await dbClient.exercise_posts.count({
        where: { exercise_tp: exerciseType },
      });
      return result;
    } else {
      const result = await dbClient.exercise_posts.count();
      return result;
    }
  };

  const getExercisePostByIdx = async (exercisrPostIdx: number) => {
    const dbClient = DbConnectionStore.getInstance();
    const result: {
      exercise_post_idx: number;
      exercise_tp: ExerciseType;
      title: string;
      contents: string;
      post_dt: Date;
      user_idx: number;
      user_id: string;
      user_permission: UserPermission;
    }[] = await dbClient.$queryRawUnsafe(
      `SELECT EP.exercise_post_idx,
                    EP.exercise_tp,
                    EP.title,
                    EP.contents,
                    EP.post_dt,
                    U.user_idx,
                    U.user_id,
                    U.user_permission
             FROM exercise_posts EP
                      JOIN users U ON EP.user_idx = U.user_idx
             WHERE EP.exercise_post_idx = ${exercisrPostIdx}`
    );
    return result;
  };

  const updatePost = async ({
    exercisePostIdx,
    exerciseTp,
    title,
    contents,
    updateUserIdx,
    updateDt,
  }: {
    exercisePostIdx: number;
    exerciseTp: ExerciseType;
    title: string;
    contents: string;
    updateUserIdx: number;
    updateDt: Date;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    await dbClient.exercise_posts.update({
      where: {
        exercise_post_idx: exercisePostIdx,
      },
      data: {
        exercise_tp: exerciseTp,
        title: title,
        contents: contents,
        update_user_idx: updateUserIdx,
        update_dt: updateDt,
      },
    });
  };

  const deleteExercisePost = async (exercisePostIdx: number) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.exercise_posts.delete({
      where: {
        exercise_post_idx: exercisePostIdx,
      },
    });

    return result;
  };

  const getExercisePostsByUserIdx = async (userIdx: number) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.exercise_posts.findMany({
      where: {
        user_idx: userIdx,
      },
      orderBy: {
        exercise_post_idx: 'desc',
      },
    });

    return result;
  };

  return {
    insertExercisePost,
    getExercisePosts,
    getPostCount,
    getExercisePostByIdx,
    updatePost,
    deleteExercisePost,
    getExercisePostsByUserIdx,
  };
};
export default ExercisePostRepository;
