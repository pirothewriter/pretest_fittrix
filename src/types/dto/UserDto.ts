import { UserPermission } from '../enums/UserPermission';

export interface UserDto {
  userIdx: number;
  userId: string;
  userPermission: UserPermission;
}
