import { UsersController } from '../controllers/UsersController';
import ExerciseService from './ExerciseService';
import { ExerciseType } from '../types/enums/ExerciseType';
import { UNAUTORIZED } from '../types/exceptions/AuthorizationExceptions';
import { NOT_FILL_FIELD } from '../types/exceptions/ExerciseExceptions';

describe('Exercise Service Test', () => {
  let authorizedToken: string;

  beforeAll(async () => {
    const loginResponse = await new UsersController().login({
      id: 'test',
      password: 'test',
    });
    authorizedToken = loginResponse.authorizedToken;
  });

  it('게시물 등록 테스트', async () => {
    expect(
      await ExerciseService().addExercisePost({
        authorizationToken: authorizedToken,
        exercisePostRequest: {
          contents: 'test',
          exerciseType: ExerciseType.SQUARS,
          photoUrls: ['test', 'test1'],
          title: 'test',
        },
      })
    ).toBeTruthy();
  });

  it('게시물 등록시 인증 없이 시도할 경우', async () => {
    await expect(async () => {
      await ExerciseService().addExercisePost({
        authorizationToken: undefined,
        exercisePostRequest: {
          contents: 'test',
          exerciseType: ExerciseType.SQUARS,
          photoUrls: ['test', 'test1'],
          title: 'test',
        },
      });
    }).rejects.toEqual(UNAUTORIZED);
  });

  it('게시물 등록시 제목에 데이터를 넣지 않고 시도할 경우', async () => {
    await expect(async () => {
      await ExerciseService().addExercisePost({
        authorizationToken: authorizedToken,
        exercisePostRequest: {
          contents: 'test',
          exerciseType: ExerciseType.SQUARS,
          photoUrls: ['test', 'test1'],
          title: '',
        },
      });
    }).rejects.toEqual(NOT_FILL_FIELD);
  });
});
