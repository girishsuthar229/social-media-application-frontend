export interface AllSavedPostListPaylod {
  sortBy?: string;
  sortOrder?: string;
}

export interface AllSavedPostList {
  post_id: number;
  image_url: string | null;
  like_count: number;
  share_count: number;
  comment_count: number;
}
export interface IAllSavedPostListResponse {
  count: number;
  rows: AllSavedPostList[];
}
