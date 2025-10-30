"use client";

import useSWR from 'swr';
import * as answerApi from '@/utils/api/answerApi';
import { IAnswer, PaginatedAnswers } from '@/lib/types';
import Link from 'next/link';
import { useUserStore } from '@/hooks/useUserStore';
import PixelLoader from '@/components/PixelLoader';


const MyAnswerItem = ({ answer }: { answer: IAnswer }) => {
    return (
        <Link
        href={`/questions/${answer.questionId}`}
        className="block bg-white border-4 border-black pixel-shadow hover:bg-so-yellow transition-all hover:translate-x-0.5 hover:translate-y-0.5"
        >
        <div className="p-5">
            <div className="flex justify-between items-center">
            <span className="pixel-text text-xs text-so-gray">
                Your answer to question: {answer.questionId}
            </span>
            {answer.status === 'selected' && (
                <span className="pixel-text text-xs text-white bg-so-green border-2 border-black px-2 py-1">
                🏆 AWARDED
                </span>
            )}
            {answer.status === 'spam' && (
                <span className="pixel-text text-xs text-white bg-so-red border-2 border-black px-2 py-1">
                SPAM
                </span>
            )}
            </div>
            <p className="font-mono text-base text-so-black mt-3 truncate">
            {answer.answerText}
            </p>
        </div>
        </Link>
    );
    };

    // The main page
    export default function MyAnswersPage() {
    const walletAddress = useUserStore((s) => s.walletAddress);

    const { data: paginatedData, error, isLoading } = useSWR<PaginatedAnswers>(
        walletAddress ? '/answers/my-answers' : null,
        () => answerApi.getMyAnswers(walletAddress!),
        {
        shouldRetryOnError: false, 
    }
    );

    const answers = paginatedData?.answers;

    const renderContent = () => {
    // State 1: Not logged in
    if (!walletAddress) {
        return (
            <div className="border-4 border-so-red bg-so-yellow p-4 pixel-text text-so-red">
            Please connect your wallet to see your answers.
            </div>
        );
        }

        if (isLoading) {
        return <PixelLoader />;
        }

        // State 3: Error
        if (error) {
        return (
            <div className="border-4 border-so-red bg-so-yellow p-4 pixel-text text-so-red">
            Error loading answers: {error.message}
            </div>
        );
        }

        // State 4: Data is loaded
        if (answers) {
        if (answers.length === 0) {
            return <p className="font-mono text-so-gray">You haven't posted any answers yet.</p>;
        }

        return (
            <div className="space-y-6">
            {answers.map((a) => (
                <MyAnswerItem key={a._id} answer={a} />
            ))}
            </div>
        );
        }

        return null;
    };
    
    return (
        <div className="w-full">
        <h1 className="pixel-text text-3xl font-black text-so-black mb-8">
            My Answers
        </h1>
        
        {renderContent()}
        </div>
    );
}