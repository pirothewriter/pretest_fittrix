import DbConnectionStore from '../intrastructure/DbConnectionStore';

const ExercisePhotoRepository = () => {
  const insertPhotos = async ({
    exercisePostIdx,
    photos,
  }: {
    exercisePostIdx: number;
    photos: string[];
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.exercise_photos.createMany({
      data: photos.map((photo) => {
        return {
          exercise_post_idx: exercisePostIdx,
          photo_url: photo,
        };
      }),
    });
    return result;
  };

  const getPhotosByExercisePostIdx = async ({
    exercisePostIdxs,
  }: {
    exercisePostIdxs: number[];
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.exercise_photos.findMany({
      where: {
        exercise_post_idx: { in: exercisePostIdxs },
      },
    });

    return result;
  };

  const deleteExercisePhotosByExercisePostIdx = async (
    exercisePostIdx: number
  ) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.exercise_photos.deleteMany({
      where: {
        exercise_post_idx: exercisePostIdx,
      },
    });
    return result;
  };

  return {
    insertPhotos,
    getPhotosByExercisePostIdx,
    deleteExercisePhotosByExercisePostIdx,
  };
};
export default ExercisePhotoRepository;
