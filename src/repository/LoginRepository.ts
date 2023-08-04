import DbConnectionStore from '../intrastructure/DbConnectionStore';

const LoginRepository = () => {
  const insertLoginInfo = async ({
    userIndex,
    authorizedToken,
    refreshToken,
    loginDt,
    expireDt,
  }: {
    userIndex: number;
    authorizedToken: string;
    refreshToken: string;
    loginDt: Date;
    expireDt: Date;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    await dbClient.logined_users.create({
      data: {
        user_idx: userIndex,
        authorized_token: authorizedToken,
        refresh_token: refreshToken,
        login_dt: loginDt,
        expire_dt: expireDt,
      },
    });
  };

  const getExpiredDt = async ({
    authorizedToken,
  }: {
    authorizedToken: string;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.logined_users.findMany({
      where: {
        authorized_token: authorizedToken,
      },
      orderBy: {
        expire_dt: 'desc',
      },
    });

    if (!result || result.length === 0) {
      return null;
    }

    return result[result.length - 1].expire_dt;
  };

  const deleteLoginInfo = async (userIdx: number) => {
    const dbClient = DbConnectionStore.getInstance();
    await dbClient.logined_users.deleteMany({
      where: {
        user_idx: userIdx,
      },
    });
  };

  return {
    insertLoginInfo,
    getExpiredDt,
    deleteLoginInfo,
  };
};

export default LoginRepository;
