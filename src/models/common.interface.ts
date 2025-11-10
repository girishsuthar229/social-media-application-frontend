export interface BaseSearchParams {
  limit?: number;
  offset?: number;
}

export type SearchPayload<T> = BaseSearchParams & T;

export interface IApiResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T | null;
  error?: string;
}

export interface IApiError {
  statusCode: number;
  message: string;
  error?: string;
}
