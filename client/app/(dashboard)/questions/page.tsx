"use client";

import useSWR from 'swr';
import * as questionApi from '@/utils/api/questionApi';
import { IQuestion } from '@/lib/types';
import Link from 'next/link';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';


const QuestionItem = ({ question }: { question: IQuestion }) => {
    const bountyInSol = (question.bountyAmountLamports || 0) / LAMPORTS_PER_SOL;

    return (
        <Link
        href={`/questions/${question._id}`}
        className="block bg-white border-4 border-black pixel-shadow hover:bg-so-yellow transition-all hover:translate-x-0.5 hover:translate-y-0.5"
        >
        <div className="p-5 flex justify-between items-center">
            <div>
            <h3 className="pixel-text text-lg font-bold text-so-black">
                {question.title}
            </h3>
            <p className="font-mono text-xs text-so-gray mt-2">
                Asked by: {question.askerWallet.substring(0, 6)}...
            </p>
            </div>
            <div className="text-right shrink-0 ml-4">
            <div className="pixel-text text-xl font-bold text-so-green">
                {bountyInSol} SOL
            </div>
            <span className="font-mono text-xs text-so-gray">Bounty</span>
            </div>
        </div>
        </Link>
    );
    };


    export default function QuestionsPage() {
    const { data: questionData, error } = useSWR(
        '/questions',
        () => questionApi.getOpenQuestions(1) 
    );

    return (
        <div className="w-full">
        <h1 className="pixel-text text-3xl font-black text-so-black mb-8">
            Open Bounties
        </h1>
        
        {error && (
            <div className="border-4 border-so-red bg-so-yellow p-4 pixel-text text-so-red">
            Error loading questions: {error.message}
            </div>
        )}

        {!questionData && !error && (
            <div className="pixel-text text-so-gray">Loading questions...</div>
        )}

        {questionData && (
            <div className="space-y-6">
            {questionData.questions.length === 0 && (
                <p className="font-mono text-so-gray">No open bounties right now. Why not ask one?</p>
            )}
            {questionData.questions.map((q) => (
                <QuestionItem key={q._id} question={q} />
            ))}
            {/* TODO: Add pagination controls here */}
            </div>
        )}
        </div>
    );
}