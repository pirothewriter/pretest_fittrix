import { UserDto } from '../dto/UserDto';
import { ExerciseType } from '../enums/ExerciseType';

export interface ExercisePost {
  user: UserDto;
  exercisePostIdx: number;
  title: string;
  contents: string;
  exerciseTp: ExerciseType;
  postDt: Date;
  photos: string[];
}

export interface ExercisePostResponse {
  data: ExercisePost[];
  page: number;
  totalPage: number;
  postPerPage: number;
}
