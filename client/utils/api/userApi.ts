import axiosInstance from '@/lib/axios';

export interface User {
  _id: string;
  username: string;
  walletAddress: string;
  reputation: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

/**
 * Check if a user exists by wallet address
 */
export const getUserProfile = async (walletAddress: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>(
    `/users/profile/${walletAddress}`
  );
  return response.data.data;
};

/**
 * Register a new user or login existing user
 */
export const loginUser = async (
  walletAddress: string,
  username: string
): Promise<User> => {
  const response = await axiosInstance.post<ApiResponse<User>>('/users/login', {
    walletAddress,
    username,
  });
  return response.data.data;
};

/**
 * Update username for existing user
 */
export const updateUsername = async (
  walletAddress: string,
  username: string
): Promise<User> => {
  const response = await axiosInstance.patch<ApiResponse<User>>(
    `/users/${walletAddress}/username`,
    { username }
  );
  return response.data.data;
};

/**
 * Restore user reputation
 */
export const restoreReputation = async (
  walletAddress: string,
  amount: number
): Promise<User> => {
  const response = await axiosInstance.patch<ApiResponse<User>>(
    `/users/${walletAddress}/restore-reputation`,
    { amount }
  );
  return response.data.data;
};