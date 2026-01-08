/* eslint-disable @typescript-eslint/no-explicit-any */

import { IApiResponse, SearchPayload } from "@/models/common.interface";
import { trackPromise } from "react-promise-tracker";
import BaseService from "./base-service.service";
import {
  IMessageAllUsersListResponse,
  AllMsgUsersPaylod,
  SendMessagePayload,
  IUserMessage,
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
  IApiResponse<{ totalCount: number }>
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
