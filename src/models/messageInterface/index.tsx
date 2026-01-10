export interface SendMessagePayload {
  sender_id: string;
  receiver_id: string;
  message: string;
  file?: File;
  file_type?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
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
    status?: string;
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
  status: string;
  is_read: boolean;
  deleted_date: string;
  is_edited: boolean;
  file_url?: string;
  file_type?: "image" | "video" | "document" | "audio";
  file_name?: string;
  file_size?: number;
  latitude?: number;
  longitude?: number;
  location_name?: string;
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

export interface IUserReadMessage {
  selected_user_id: number;
  current_user_id: number;
}

export interface IUserTypingMessage {
  receiver_id: number;
  is_typing: boolean;
  type_user_id: number;
  type_user_name: string;
}

export interface IEditMessagePayload {
  message_id: number;
  message: string;
}

export interface IDeleteMessagePayload {
  message_id: number;
}
