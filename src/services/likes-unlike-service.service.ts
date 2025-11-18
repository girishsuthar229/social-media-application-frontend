import { IApiResponse } from "@/models/common.interface";
import { IPostData } from "@/models/postInterface";
import { trackPromise } from "react-promise-tracker";
import BaseService from "./base-service.service";
import { LikeUserListResponse } from "@/models/likesInterface";

export const likePostClickServices = async (
  postId: number
): Promise<IApiResponse<IPostData>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/likes/${postId}/like`)
    );
    const res = response.data;
    return Promise.resolve(res);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const unLikePostClickServices = async (
  postId: number
): Promise<IApiResponse<IPostData>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/likes/${postId}/un-like`)
    );
    const res = response.data;
    return Promise.resolve(res);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};

export const allLikePostClickServices = async (
  postId: number
): Promise<IApiResponse<LikeUserListResponse[]>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/likes/${postId}/all-users-list`)
    );
    const res = response.data;
    return Promise.resolve(res);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null as any,
    });
  }
};
