export interface IFollowResponse {
  id: number;
  user_name: string;
  is_following?: boolean;
  follow_status?: string | null;
}

export interface FollowAllUsersPaylod {
  sortBy?: string;
  sortOrder?: string;
}

export interface FollowUserListResponse {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  bio?: string;
  is_following?: boolean;
  follow_status?: string | null;
}

export interface IFollowUserList {
  count: number;
  rows: FollowUserListResponse[];
}

export interface PendingFollowPaylod {
  sortBy?: string;
  sortOrder?: string;
}

export interface PendingFollowResponse {
  id: number;
  created_date: string;
  follow_me_status: string | null;
  user: {
    user_id: number;
    user_name: string;
    first_name?: string;
    last_name?: string;
    photo_url?: string | null;
    bio?: string | null;
    is_following?: boolean;
    follow_status: string | null;
  };
}

export interface IPendingFollowList {
  count: number;
  rows: PendingFollowResponse[];
}
