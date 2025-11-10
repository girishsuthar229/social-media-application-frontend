export interface ILoginResData {
  accessToken: string;
  tokenExpiresIn: number;
}
export interface ILoginPayload {
  user_name: string;
  password: string;
}
