import { string } from "yup";

export interface UserUploadPostReponse {
  id: number;
  post_img_url: string;
}

export interface IUserResponseData {
  id: number;
  user_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  bio: string | null;
  mobile_number: string | null;
  photo_url: string | null;
  birth_date: string | null;
  role_id: number;
  address?: string | null;
  is_private?: boolean;
  follower_count?: number;
  following_count?: number;
  post_count?: number;
}

export interface IUpdateUserProfile {
  user_name: string;
  first_name?: string;
  last_name?: string;
  bio?: string | null;
  birth_date?: string;
  mobile_number?: string;
  user_image?: File | string | null;
  is_private?: boolean;
  role_id?: number;
  address?: string;
}
export interface UserAllListPaylod {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface UserAllListModel {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string | null;
  mobile_number?: string;
  photo_url?: string | null;
  birth_date?: Date | null;
  address?: string | null;
  is_private: boolean;
  follow_status: string;
  is_following: boolean;
  follower_count: number;
  following_count: number;
  role_id: number;
  created_date: Date;
  modified_date: Date | null;
}
export interface IUserAllListResponse {
  count: number;
  rows: UserAllListModel[];
}

export interface IAnotherUserResponse {
  id: number;
  user_name: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  photo_url: string | null;
  is_private?: boolean;
  is_following?: boolean;
  follower_count?: number;
  following_count?: number;
  post_count?: number;
}
