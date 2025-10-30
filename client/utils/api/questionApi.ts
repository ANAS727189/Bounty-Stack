import axiosInstance from '@/lib/axios';
import type { ApiResponse, IQuestion, PaginatedQuestions } from '@/lib/types';

/**
 * Create a new question (status: pending_funding)
 */
export const createQuestion = async (
  title: string,
  descriptionLink: string,
  token: string // The walletAddress
): Promise<IQuestion> => {
  const response = await axiosInstance.post<ApiResponse<IQuestion>>(
    '/questions',
    { title, descriptionLink },
    { headers: { 'x-wallet-address': token } }
  );
  return response.data.data;
};

/**
 * Fund a question after the Solana TX (status: open)
 */
export const fundQuestion = async (
  questionId: string,
  bountyPda: string,
  bountyAmountLamports: number,
  token: string
): Promise<IQuestion> => {
  const response = await axiosInstance.patch<ApiResponse<IQuestion>>(
    `/questions/${questionId}/fund`,
    { bountyPda, bountyAmountLamports },
    { headers: { 'x-wallet-address': token } }
  );
  return response.data.data;
};

/**
 * Get all open questions
 */
export const getOpenQuestions = async (page = 1): Promise<PaginatedQuestions> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedQuestions>>(
    `/questions?status=open&page=${page}`
  );
  return response.data.data;
};

/**
 * Get a single question by its ID
 */
export const getQuestionById = async (questionId: string): Promise<IQuestion> => {
  const response = await axiosInstance.get<ApiResponse<IQuestion>>(
    `/questions/${questionId}`
  );
  return response.data.data;
};