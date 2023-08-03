import { UserDto } from '../dto/UserDto';

export interface CommentResponse {
  user: UserDto;
  comment: string;
  commentDt: Date;
}

export interface CommentsResponse {
  comments: CommentResponse[];
  count: number;
}
