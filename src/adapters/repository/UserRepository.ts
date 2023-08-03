import { UserPermission } from '../../types/enums/UserPermission';
import DbConnectionStore from '../intrastructure/DbConnectionStore';

const UserRepository = () => {
  const getUserByIdAndPassword = async (id: string, password: string) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.users.findFirst({
      where: {
        user_id: id,
        password: password,
      },
    });

    if (!result) {
      return null;
    }

    return {
      userIdx: result.user_idx,
      userId: result.user_id,
      userPermission: result.user_permission,
    };
  };

  const getUserById = async (id: string) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.users.findFirst({
      where: {
        user_id: id,
      },
    });

    if (!result) {
      return null;
    }

    return {
      userIdx: result.user_idx,
      userId: result.user_id,
      userPermission: result.user_permission,
    };
  };

  const insertUser = async ({
    id,
    password,
    userPermission,
  }: {
    id: string;
    password: string;
    userPermission: UserPermission;
  }) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.users.create({
      data: {
        user_id: id,
        password: password,
        user_permission: userPermission,
      },
    });

    return result;
  };

  const getUserByIdx = async (userIdx: number) => {
    const dbClient = DbConnectionStore.getInstance();
    const result = await dbClient.users.findUnique({
      where: {
        user_idx: userIdx,
      },
    });

    return result;
  };

  return {
    getUserByIdAndPassword,
    getUserById,
    insertUser,
    getUserByIdx,
  };
};
export default UserRepository;
