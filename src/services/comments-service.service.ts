/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommentUserListResponse } from "@/models/commentsInterface";
import { IApiResponse } from "@/models/common.interface";
import BaseService from "./base-service.service";
import { trackPromise } from "react-promise-tracker";

export const allCommentPostClickServices = async (
  postId: number
): Promise<IApiResponse<CommentUserListResponse[]>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/comments/${postId}/all-users-list`)
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
export const userCommentOnPostServices = async (
  postId: number,
  payload: { comment: string }
): Promise<IApiResponse<CommentUserListResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post(`/comments/${postId}/user-comment`, payload)
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

export const deleteCommentPostClickServices = async (
  commentId: number
): Promise<IApiResponse<CommentUserListResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.delete(`/comments/${commentId}`)
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
