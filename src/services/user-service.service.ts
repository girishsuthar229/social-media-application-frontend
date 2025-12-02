import { IApiResponse, SearchPayload } from "@/models/common.interface";
import { trackPromise } from "react-promise-tracker";
import BaseService from "./base-service.service";
import {
  IUpdateUserProfile,
  IUserResponseData,
  IUserAllListResponse,
  UserAllListPaylod,
  IAnotherUserResponse,
} from "@/models/userInterface";

export const userDetail = async (): Promise<
  IApiResponse<IUserResponseData>
> => {
  try {
    const response = await trackPromise(BaseService.get("/users/detail"));
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

export const updateProfileData = async (
  values: FormData
): Promise<IApiResponse<null>> => {
  try {
    const response = await trackPromise(
      BaseService.put("/users/update-profile", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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

export const getAllUsers = async (
  values: SearchPayload<UserAllListPaylod>
): Promise<IApiResponse<IUserAllListResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/get-all-users", values)
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

export const getAnotherUserProfile = async (
  username: string
): Promise<IApiResponse<IAnotherUserResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.get(`/users/profile/${username}`)
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
