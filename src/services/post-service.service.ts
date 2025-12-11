/* eslint-disable @typescript-eslint/no-explicit-any */
import { IApiResponse, SearchPayload } from "@/models/common.interface";
import {
  AllPostListPaylod,
  IPostData,
  IGetAllPostsResponse,
  IUserWiseAllPostsResponse,
  UserWiseAllPoststPaylod,
  IGetPostByIdReponse,
  IUpdatePayload,
} from "@/models/postInterface";
import BaseService from "@/services/base-service.service";
import { trackPromise } from "react-promise-tracker";

export const createPost = async (
  postData: FormData
): Promise<IApiResponse<IPostData>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/posts/create", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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

export const getUserUploadPost = async (
  values: SearchPayload<UserWiseAllPoststPaylod>
): Promise<IApiResponse<IUserWiseAllPostsResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/posts/get-user-wise-all-posts", values)
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

export const getAllPosts = async (
  values: SearchPayload<AllPostListPaylod>
): Promise<IApiResponse<IGetAllPostsResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/posts/get-all-post", values)
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

export const getPostById = async (
  postId: number
): Promise<IApiResponse<IGetPostByIdReponse>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/posts/post/${postId}`)
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

export const updatePost = async (
  postId: number,
  postData: IUpdatePayload
): Promise<IApiResponse<IPostData>> => {
  try {
    const response = await trackPromise(
      BaseService.put(`/posts/update/${postId}`, postData)
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

export const deletePost = async (
  postId: number
): Promise<IApiResponse<null>> => {
  try {
    const response = await trackPromise(BaseService.delete(`/posts/${postId}`));
    const res = response.data;
    return Promise.resolve(res);
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null,
    });
  }
};
