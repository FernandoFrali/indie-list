export type ApiError = {
  data: null;
  error: string;
};

export type ApiResponse<T> =
  | {
    data: T;
    error: null;
  }
  | ApiError;
