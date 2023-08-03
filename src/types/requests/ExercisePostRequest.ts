import { ExerciseType } from '../enums/ExerciseType';

export interface ExercisePostRequest {
  exerciseType: ExerciseType;
  photoUrls: string[];
  title: string;
  contents: string;
}
