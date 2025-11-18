import { IApiResponse } from "@/models/common.interface";
import { IFollowResponse } from "@/models/followsInterface";
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
