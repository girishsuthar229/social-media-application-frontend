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
  photo_url: string;
  message: {
    id: number;
    sender_id: number;
    receiver_id: number;
    last_message: string;
    created_date: string;
    modified_date: string | null;
    is_read?: boolean;
  };
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
  message: string;
  created_date: string;
  modified_date?: string;
  is_read?: boolean;
  sender: {
    id: number;
    user_name: string;
    first_name: string | null;
    last_name: string | null;
    photo_url: string | null;
  };
  receiver: {
    id: number;
    user_name: string;
    first_name: string | null;
    last_name: string | null;
    photo_url?: string | null;
  };
}
