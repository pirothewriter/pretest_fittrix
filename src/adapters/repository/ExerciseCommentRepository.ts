import DbConnectionStore from '../intrastructure/DbConnectionStore';

const ExerciseCommentRepository = () => {
  const insertComment = async ({
    userIdx,
    comment,
    commentDt,
    exercisePostIdx,
  }: {
    userIdx: number;
    comment: string;
    commentDt: Date;
    exercisePostIdx: number;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    await dbClient.exercise_comments.create({
      data: {
        exercise_post_idx: exercisePostIdx,
        user_idx: userIdx,
        comment: comment,
        comment_dt: commentDt,
      },
    });
  };

  const getCommentWithUserByExercisePostIdx = async (
    exercisePostIdx: number
  ) => {
    const dbClient = DbConnectionStore.getInstance();
    const queryResult =
      await dbClient.$queryRaw`SELECT U.user_idx, U.user_id, U.user_permission, EC.comment, EC.comment_dt FROM exercise_comments EC JOIN users U ON U.user_idx = EC.user_idx WHERE EC.exercise_post_idx = ${exercisePostIdx}`;
    return queryResult;
  };

  return {
    insertComment,
    getCommentWithUserByExercisePostIdx,
  };
};
export default ExerciseCommentRepository;
