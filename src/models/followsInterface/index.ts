export interface IFollowResponse {
  id: number;
  user_name: string;
  is_following: boolean;
  followers_count?: number;
  following_count?: number;
}
