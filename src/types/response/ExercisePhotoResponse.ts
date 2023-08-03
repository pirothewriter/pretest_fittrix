export interface ExercisePhotos {
  photoUrls: string[];
  postDt: Date;
  hasPrevius: boolean;
  hasNext: boolean;
}

export interface ExercisePhotoResponse {
  exercisePhotos: ExercisePhotos[];
}
