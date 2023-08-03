import UserRepository from './UserRepository';

describe('User Repository 테스트', () => {
  it('조회 테스트', async () => {
    const result = await UserRepository().getUserByIdAndPassword(
      'test',
      'test'
    );
    expect(result).not.toBeNull();
  });

  it('조회시 데이터가 없을경우', async () => {
    const result = await UserRepository().getUserByIdAndPassword(
      'test1',
      'test'
    );
    expect(result).toBeNull();
  });
});
