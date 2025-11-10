// Interface for Forgot Password
export interface IForgotPasswordPayload {
  email: string;
}
export interface ISendOtpResponse {
  token?: string;
}

export interface IVerifyTokenPayload {
  token: string;
}

export interface ITokenValidationResponse {
  valid: boolean;
  remainingTime: number;
}

export interface IVerifyOtpPayload {
  token: string;
  otp: string;
}
export interface IVerifyOtpResponse {
  verified: boolean;
  token?: string;
}

export interface IValidateSetPasswordResponse {
  valid: boolean;
  email: string;
  setToken: string;
}

export interface IUpdatePasswordPayload {
  setToken: string;
  email: string;
  new_password: string;
  confirm_password: string;
}
