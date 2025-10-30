export interface IUser {
  _id: string;
  username: string;
  walletAddress: string;
  reputation: number;
  createdAt: string;
}

export interface IQuestion {
  _id: string;
  title: string;
  descriptionLink?: string;
  askerWallet: string;
  bountyPda?: string;
  bountyAmountLamports?: number;
  status: 'pending_funding' | 'open' | 'awarded' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface IAnswer {
  _id: string;
  answerText: string;
  answererWallet: string;
  questionId: string;
  status: 'active' | 'selected' | 'spam' | 'wrong';
  createdAt: string;
  updatedAt: string;
}

// This matches your backend's sendSuccess wrapper
export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

// For paginated question results
export interface PaginatedQuestions {
  questions: IQuestion[];
  currentPage: number;
  totalPages: number;
  totalQuestions: number;
}

// For paginated answer results
export interface PaginatedAnswers {
  answers: IAnswer[];
  currentPage: number;
  totalPages: number;
  totalAnswers: number;
}