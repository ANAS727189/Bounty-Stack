import axiosInstance from '@/lib/axios';
import type { ApiResponse, IAnswer, PaginatedAnswers } from '@/lib/types';

/**
 * Get all answers for a specific question
 */
export const getAnswersForQuestion = async (
  questionId: string,
  page = 1
): Promise<PaginatedAnswers> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedAnswers>>(
    `/answers/question/${questionId}?page=${page}`
  );
  return response.data.data;
};

/**
 * Get all answers submitted by the logged-in user
 */
export const getMyAnswers = async (token: string): Promise<PaginatedAnswers> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedAnswers>>(
    '/answers/my-answers',
    { headers: { 'x-wallet-address': token } }
  );
  return response.data.data;
};

/**
 * Add a new answer to a question
 */
export const addAnswer = async (
  questionId: string,
  answerText: string,
  token: string
): Promise<IAnswer> => {
  const response = await axiosInstance.post<ApiResponse<IAnswer>>(
    `/answers/question/${questionId}`,
    { answerText },
    { headers: { 'x-wallet-address': token } }
  );
  return response.data.data;
};

/**
 * Mark an answer as correct
 */
export const markAnswerCorrect = async (
  answerId: string,
  token: string
): Promise<void> => {
  await axiosInstance.patch(
    `/answers/${answerId}/correct`,
    {},
    { headers: { 'x-wallet-address': token } }
  );
};

/**
 * Mark an answer as spam
 */
export const markAnswerSpam = async (
  answerId: string,
  token: string
): Promise<void> => {
  await axiosInstance.patch(
    `/answers/${answerId}/spam`,
    {},
    { headers: { 'x-wallet-address': token } }
  );
};

/**
 * Mark an answer as wrong
 */
export const markAnswerWrong = async (
  answerId: string,
  token: string
): Promise<void> => {
  await axiosInstance.patch(
    `/answers/${answerId}/wrong`,
    {},
    { headers: { 'x-wallet-address': token } }
  );
};