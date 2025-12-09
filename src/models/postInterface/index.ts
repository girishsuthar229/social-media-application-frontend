export interface IPostData {
  id: number;
  content: string;
  image_url: string | null;
  like_count: number;
  share_count: number;
  comment: string | null;
  user: {
    id: string;
    user_name: string;
    first_name: string;
    last_name: string;
    user_image: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ICreatePostPayload {
  content: string;
  image_url?: File;
  comment?: string;
}

export interface AllPostListPaylod {
  sortBy?: string;
  sortOrder?: string;
}

export interface PostComment {
  id: number;
  content: string;
  user_id: number;
  user_name: string;
  created_date: string;
}

export interface PostUser {
  id: number;
  user_name: string;
  profile_pic_url: string;
}

export interface AllPostListModel {
  post_id: number;
  content: string;
  image_url: string;
  like_count: number;
  share_count: number;
  comment_count: number;
  self_comment: string | null;
  comments: PostComment[];
  user: PostUser;
  created_date: string;
  modified_date: string | null;
  is_liked: boolean;
  is_saved: boolean;
}

export interface IGetAllPostsResponse {
  count: number;
  rows: AllPostListModel[];
}

export interface UserWiseAllPoststPaylod {
  userId: number;
  sortBy?: string;
  sortOrder?: string;
}
export interface UserWiseAllPostsData {
  post_id: number;
  image_url: string;
  like_count: number;
  share_count: number;
  comment_count: number;
  content: string;
  self_comment: string | null;
  comments: PostComment[];
  user: PostUser;
  created_date: string;
  modified_date: string | null;
  is_liked: boolean;
  is_saved: boolean;
}
export interface IUserWiseAllPostsResponse {
  count: number;
  rows: UserWiseAllPostsData[];
}

export interface IGetPostByIdReponse {
  id: number;
  content: string;
  image_url: string;
  like_count: number;
  share_count: number;
  self_comment: string | null;
  comment_count: number;
  created_date: string;
  modified_date: string | null;
  is_liked: boolean;
  is_saved: boolean;
  user: {
    id: number;
    user_name: string;
    profile_pic_url: string;
  };
}

export interface IUpdatePayload {
  user_id: number;
  content: string;
  comment?: string;
}
