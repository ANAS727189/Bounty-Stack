"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import * as questionApi from '@/utils/api/questionApi';
import * as answerApi from '@/utils/api/answerApi';
import { IQuestion, IAnswer } from '@/lib/types';
import { useUserStore } from '@/hooks/useUserStore';
import { useSolanaProgram } from '@/hooks/useSolanaProgram';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';

interface PaginatedAnswers {
  answers: IAnswer[];
  totalAnswers: number;
}

// --- Answer Item Component ---
const AnswerItem = ({
  answer,
  isAsker,
  questionId,
  questionStatus,
}: {
  answer: IAnswer;
  isAsker: boolean;
  questionId: string;
  questionStatus: IQuestion['status'];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const walletAddress = useUserStore((s) => s.walletAddress);
  const { awardBounty } = useSolanaProgram();

  const canTakeAction = isAsker && questionStatus === 'open' && answer.status === 'active';

  const handleMarkCorrect = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      // Step 1: Tell backend to update state
      await answerApi.markAnswerCorrect(answer._id, walletAddress);
      toast.success('Database updated! Please approve the blockchain transaction to send the bounty.');
      
      // Step 2: Call Solana program
      const { txSignature } = await awardBounty(questionId, answer.answererWallet);
      toast.success(`Bounty awarded! TX: ${txSignature.substring(0, 10)}...`);
      
      // Re-fetch all data on the page
      mutate(`/questions/${questionId}`);
      mutate(`/answers/${questionId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to award bounty');
    }
    setIsLoading(false);
  };

  const handleMarkSpam = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      await answerApi.markAnswerSpam(answer._id, walletAddress);
      toast.success('Answer marked as spam. User penalized.');
      mutate(`/answers/${questionId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as spam');
    }
    setIsLoading(false);
  };

  const handleMarkWrong = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      await answerApi.markAnswerWrong(answer._id, walletAddress);
      toast.success('Answer marked as incorrect.');
      mutate(`/answers/${questionId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as wrong');
    }
    setIsLoading(false);
  };

  const getStatusBorder = () => {
    switch (answer.status) {
      case 'selected': return 'border-so-green bg-green-50';
      case 'spam':
      case 'wrong': return 'border-so-red bg-red-50 opacity-70';
      default: return 'border-black bg-white';
    }
  };

  return (
    <div className={`border-4 ${getStatusBorder()} pixel-shadow-lg`}>
      <div className="border-b-4 border-black p-4 bg-so-light-gray flex justify-between items-center">
        <span className="pixel-text text-xs text-so-dark-gray">
          Answer from @{answer.answererWallet.substring(0, 6)}...
        </span>
        {answer.status === 'selected' && (
          <span className="pixel-text text-xs text-white bg-so-green border-2 border-black px-2 py-1">
            🏆 AWARDED
          </span>
        )}
      </div>
      <p className="font-mono text-base text-so-black p-6 whitespace-pre-wrap">
        {answer.answerText}
      </p>
      {canTakeAction && (
        <div className="border-t-4 border-black p-4 bg-so-yellow flex flex-wrap gap-3">
          <button
            onClick={handleMarkCorrect}
            disabled={isLoading}
            className="pixel-button bg-so-green text-white text-xs py-2 px-3"
          >
            Mark Correct
          </button>
          <button
            onClick={handleMarkWrong}
            disabled={isLoading}
            className="pixel-button bg-so-orange text-white text-xs py-2 px-3"
          >
            Mark Wrong
          </button>
          <button
            onClick={handleMarkSpam}
            disabled={isLoading}
            className="pixel-button bg-so-red text-white text-xs py-2 px-3"
          >
            Mark Spam
          </button>
        </div>
      )}
    </div>
  );
};

// --- Add Answer Form Component ---
const AddAnswerForm = ({ questionId, onAnswerPosted }: { questionId: string, onAnswerPosted: () => void }) => {
  const [answerText, setAnswerText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const walletAddress = useUserStore((s) => s.walletAddress);
  const reputation = useUserStore((s) => s.reputation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      toast.error('Connect wallet to answer');
      return;
    }
    if (reputation !== null && reputation <= 0) {
      toast.error('Your reputation is too low to post answers.');
      return;
    }
    setIsLoading(true);
    try {
      await answerApi.addAnswer(questionId, answerText, walletAddress);
      toast.success('Answer submitted!');
      setAnswerText('');
      onAnswerPosted(); // Re-fetch answers
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit answer');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <h3 className="pixel-text text-xl font-bold text-so-black mb-4">
        Your Answer
      </h3>
      <textarea
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        rows={7}
        className="w-full border-3 border-black px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-so-orange pixel-text bg-white"
        placeholder="Type your answer here... 10 character minimum."
        required
        minLength={10}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="pixel-button bg-so-blue text-white text-sm py-3 px-6 mt-4"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Post Answer'}
      </button>
    </form>
  )
}

// --- Main Question Page ---
export default function SingleQuestionPage() {
  const params = useParams();
  const questionId = params.id as string;
  const walletAddress = useUserStore((s) => s.walletAddress);

  // SWR key for the question
  const questionKey = `/questions/${questionId}`;
  // SWR key for the answers
  const answersKey = `/answers/${questionId}`;

  const { data: question, error: qError } = useSWR<IQuestion>(
    questionId ? questionKey : null,
    () => questionApi.getQuestionById(questionId)
  );
  
  const { data: answerData, error: aError } = useSWR<PaginatedAnswers>(
    questionId ? answersKey : null,
    () => answerApi.getAnswersForQuestion(questionId)
  );

  const isAsker = question && walletAddress === question.askerWallet;
  const isQuestionOpen = question && question.status === 'open';

  if (qError || aError) {
    return <div className="border-4 border-so-red bg-so-yellow p-4 pixel-text text-so-red">
      Error: {qError?.message || aError?.message}
    </div>
  }
  if (!question || !answerData) {
    return <div className="pixel-text text-so-gray">Loading...</div>;
  }

  const bountyInSol = (question.bountyAmountLamports || 0) / LAMPORTS_PER_SOL;

  return (
    <div className="w-full">
      {/* Question Header */}
      <div className="bg-white border-4 border-black pixel-shadow-lg p-8">
        <div className="flex justify-between items-start">
          <h1 className="pixel-text text-3xl font-black text-so-black">
            {question.title}
          </h1>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="pixel-text text-3xl font-bold text-so-green">
              {bountyInSol} SOL
            </div>
            <span className="font-mono text-sm text-so-gray">Bounty</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs font-mono text-so-gray">
          <span>Asked by: {question.askerWallet.substring(0, 6)}...</span>
          {question.descriptionLink && (
            <a
              href={question.descriptionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-button bg-so-black text-white text-xs py-1 px-2"
            >
              View Description
            </a>
          )}
        </div>
      </div>
      
      {/* Status Banner */}
      {question.status === 'awarded' && (
         <div className="border-4 border-so-green bg-so-yellow p-4 pixel-text text-so-green mt-8">
           🏆 This bounty has been awarded!
         </div>
      )}
      {question.status === 'cancelled' && (
         <div className="border-4 border-so-red bg-so-yellow p-4 pixel-text text-so-red mt-8">
           This bounty was cancelled.
         </div>
      )}

      {/* Answers List */}
      <div className="mt-10">
        <h2 className="pixel-text text-2xl font-bold text-so-black mb-6">
          {answerData.totalAnswers} Answers
        </h2>
        <div className="space-y-6">
          {answerData.answers.map((answer) => (
            <AnswerItem
              key={answer._id}
              answer={answer}
              isAsker={!!isAsker}
              questionId={questionId}
              questionStatus={question.status}
            />
          ))}
        </div>
      </div>

      {/* Add Answer Form */}
      {isQuestionOpen && !isAsker && (
        <AddAnswerForm 
          questionId={questionId} 
          onAnswerPosted={() => mutate(answersKey)}
        />
      )}
    </div>
  );
}