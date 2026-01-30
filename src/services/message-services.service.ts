/* eslint-disable @typescript-eslint/no-explicit-any */

import { IApiResponse, SearchPayload } from "@/models/common.interface";
import { trackPromise } from "react-promise-tracker";
import BaseService from "./base-service.service";
import {
  IMessageAllUsersListResponse,
  AllMsgUsersPaylod,
  SendMessagePayload,
  IUserMessage,
  IDeleteMessagePayload,
  IUnreadUserMessagesResponse,
} from "@/models/messageInterface";

export const getAllMsgUsers = async (
  values: SearchPayload<AllMsgUsersPaylod>
): Promise<IApiResponse<IMessageAllUsersListResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/message/get-all-msg-users", values)
    );
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const userSendMessageServices = async (
  values: SendMessagePayload
): Promise<IApiResponse<IUserMessage>> => {
  try {
    const response = await trackPromise(
      BaseService.post(`/message/send-message`, values)
    );
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const getAllMessages = async (
  selectedUserId: number
): Promise<IApiResponse<IUserMessage[]>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/message/get-user-all-messages/${selectedUserId}`)
    );
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const getUnReadMsgUsers = async (): Promise<
  IApiResponse<IUnreadUserMessagesResponse>
> => {
  try {
    const response = await trackPromise(
      BaseService.get("/message/get-unread-users-total-count")
    );
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const editMessageService = async (
  message_id: number,
  values: SendMessagePayload
): Promise<IApiResponse<IUserMessage>> => {
  try {
    const response = await trackPromise(
      BaseService.put(`/message/edit-message/${message_id}`, values)
    );
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const deleteMessageService = async (
  payload: IDeleteMessagePayload
): Promise<IApiResponse<null>> => {
  try {
    const response = await trackPromise(
      BaseService.delete(`/message/delete-message/${payload.message_id}`)
    );
    return Promise.resolve(response.data);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};
