/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse, SearchPayload } from "@/models/common.interface";
import {
  AllSavedPostListPaylod,
  IAllSavedPostListResponse,
} from "@/models/savedinterface";
import BaseService from "@/services/base-service.service";
import { trackPromise } from "react-promise-tracker";

export const savePostClickServices = async (
  postId: number
): Promise<IApiResponse<any>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/saved-posts/${postId}/save`)
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

export const unSavePostClickServices = async (
  postId: number
): Promise<IApiResponse<any>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/saved-posts/${postId}/unsave`)
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

export const getAllSavedPosts = async (
  values: SearchPayload<AllSavedPostListPaylod>
): Promise<IApiResponse<IAllSavedPostListResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/saved-posts/get-all-saved-post", values)
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
