import { UserPermission } from '../enums/UserPermission';

export interface UserResponse {
  userIdx: number;
  userId: string;
  userPermission: UserPermission;
}
