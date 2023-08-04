import { UsersController } from './UsersController';
import {
  ID_DUPLICATED,
  UNAUTORIZED,
} from '../types/exceptions/AuthorizationExceptions';

describe('UsersController Test', () => {
  beforeAll(async () => {
    try {
      const userController = new UsersController();
      await userController.signup({
        id: 'master',
        password: 'master',
        passwordConfirm: 'master',
        permission: 0,
      });
      await userController.signup({
        id: 'test',
        password: 'teset',
        passwordConfirm: 'test',
        permission: 1,
      });
    } catch (error) {
      console.log(error);
    }
  });

  it('회원가입시 동일 ID가 있을시 실패하는지 여부', async () => {
    await expect(async () => {
      await new UsersController().signup({
        id: 'master',
        password: 'master',
        passwordConfirm: 'master',
        permission: 0,
      });
    }).rejects.toEqual(ID_DUPLICATED);
  });

  it('로그인 시도시 기입한 ID가 DB에 없는 경우', async () => {
    await expect(async () => {
      await new UsersController().login({
        id: 'tetttst',
        password: 'agagagag',
      });
    }).rejects.toEqual(UNAUTORIZED);
  });

  it('로그인 시도시 ID와 비밀번호가 일치하지 않는 경우', async () => {
    await expect(async () => {
      await new UsersController().login({
        id: 'master',
        password: 'master1',
      });
    }).rejects.toEqual(UNAUTORIZED);
  });

  it('로그인 성공', async () => {
    const result = await new UsersController().login({
      id: 'master',
      password: 'master',
    });
    expect(result).not.toBeNull();
  });
});
