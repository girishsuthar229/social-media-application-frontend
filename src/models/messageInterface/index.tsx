export interface SendMessagePayload {
  sender_id: string;
  receiver_id: string;
  message: string;
}

export interface AllMsgUsersPaylod {
  searchName?: string;
  sortBy?: string;
  sortOrder?: string;
}
export interface MsgUserListResponseModel {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  photo_url: string;
  created_date: string;
  modified_date: string | null;
}

export interface IMessageAllUsersListResponse {
  count: number;
  rows: MsgUserListResponseModel[];
}

export interface IUser {
  id: number;
  user_name: string;
  email?: string;
  photo_url?: string | null;
}

export interface IUserMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
}
