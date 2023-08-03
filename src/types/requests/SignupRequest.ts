import { UserPermission } from '../enums/UserPermission';

export interface SignupRequest {
  id: string;
  password: string;
  passwordConfirm: string;
  permission: UserPermission;
}
