interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: string;
}

type AsyncResult<T> = SuccessResponse<T> | ErrorResponse;

export const handleAsync = async <T>(
  fn: () => Promise<T>
): Promise<AsyncResult<T>> => {
  try {
    const data = await fn();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error:
        error.response?.data?.message || error.message || "An error occurred",
    };
  }
};
