/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse, SearchPayload } from "@/models/common.interface";
import {
  FollowAllUsersPaylod,
  IFollowResponse,
  IFollowUserList,
  IPendingFollowList,
  PendingFollowPaylod,
} from "@/models/followsInterface";
import { trackPromise } from "react-promise-tracker";
import BaseService from "./base-service.service";

export const followUserService = async (
  userId: number
): Promise<IApiResponse<IFollowResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/follows/${userId}/follow`)
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

export const unfollowUserService = async (
  userId: number
): Promise<IApiResponse<IFollowResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/follows/${userId}/un-follow`)
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

export const followersListService = async (
  userId: number,
  values: SearchPayload<FollowAllUsersPaylod>
): Promise<IApiResponse<IFollowUserList>> => {
  try {
    const response = await trackPromise(
      BaseService.post(`/follows/${userId}/followers`, values)
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

export const followingsListService = async (
  userId: number,
  values: SearchPayload<FollowAllUsersPaylod>
): Promise<IApiResponse<IFollowUserList>> => {
  try {
    const response = await trackPromise(
      BaseService.post(`/follows/${userId}/followings`, values)
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

export const pendingAccptedFollowListService = async (
  userId: number,
  values: SearchPayload<PendingFollowPaylod>
): Promise<IApiResponse<IPendingFollowList>> => {
  try {
    const response = await trackPromise(
      BaseService.post(`/follows/${userId}/follow-requests`, values)
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

export const acceptFollowRequestService = async (
  userId: number,
  followerReqId: number
): Promise<IApiResponse<IPendingFollowList>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/follows/${userId}/request/${followerReqId}/accept`)
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
export const rejectFollowRequestService = async (
  userId: number,
  followerReqId: number
): Promise<IApiResponse<IPendingFollowList>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/follows/${userId}/request/${followerReqId}/cancel`)
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
