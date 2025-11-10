/* eslint-disable @typescript-eslint/no-explicit-any */

import { trackPromise } from "react-promise-tracker";
import BaseService from "./base-service.service";
import { IApiResponse } from "@/models/common.interface";
import { ILoginPayload, ILoginResData } from "@/models/authInterface/login";
import { ISingUpPayload } from "@/models/authInterface/singup";
import {
  IForgotPasswordPayload,
  ISendOtpResponse,
  ITokenValidationResponse,
  IUpdatePasswordPayload,
  IValidateSetPasswordResponse,
  IVerifyOtpPayload,
  IVerifyOtpResponse,
  IVerifyTokenPayload,
} from "@/models/authInterface/setPassword";

export const signUpUser = async (
  payload: ISingUpPayload
): Promise<IApiResponse<null>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/create", payload)
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

export const loginUser = async (
  payload: ILoginPayload
): Promise<IApiResponse<ILoginResData>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/auth/login", payload)
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

export const forgotPasswordUser = async (
  payload: IForgotPasswordPayload
): Promise<IApiResponse<ISendOtpResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/forgot-password/send-otp", payload)
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null,
    });
  }
};

export const validateTokenUser = async (
  payload: IVerifyTokenPayload
): Promise<IApiResponse<ITokenValidationResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/forgot-password-otp/token-validate", payload)
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null,
    });
  }
};

export const verifyOtpUser = async (
  payload: IVerifyOtpPayload
): Promise<IApiResponse<IVerifyOtpResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/forgot-password/verify-otp", payload)
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null,
    });
  }
};

export const validateSetPasswordTokenUser = async (
  payload: IVerifyTokenPayload
): Promise<IApiResponse<IValidateSetPasswordResponse>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/set-password/token-validate", payload)
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null,
    });
  }
};

export const updatePasswordUser = async (
  payload: IUpdatePasswordPayload
): Promise<IApiResponse<null>> => {
  try {
    const response = await trackPromise(
      BaseService.post("/users/set-password/update-password", payload)
    );
    return response.data;
  } catch (error: any) {
    return Promise.reject({
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
      error: error.response?.data?.error || error.response?.data || error,
      data: null,
    });
  }
};
