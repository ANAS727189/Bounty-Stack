"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/hooks/useUserStore';
import { useSolanaProgram } from '@/hooks/useSolanaProgram';
import * as questionApi from '@/utils/api/questionApi';
import { toast } from 'sonner';
import { BN } from '@coral-xyz/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function AskQuestionPage() {
    const router = useRouter();
    const walletAddress = useUserStore((s) => s.walletAddress);
    const { postBounty, program } = useSolanaProgram();
    
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Step 1 state
    const [title, setTitle] = useState('');
    const [descriptionLink, setDescriptionLink] = useState('');
    
    // Step 2 state
    const [questionId, setQuestionId] = useState('');
    const [bountyAmount, setBountyAmount] = useState('0.1');

    const handleCreateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletAddress) {
        toast.error('Please connect your wallet first');
        return;
        }
        setIsLoading(true);
        try {
        const newQuestion = await questionApi.createQuestion(
            title,
            descriptionLink,
            walletAddress
        );
        setQuestionId(newQuestion._id.toString());
        setStep(2); // Move to step 2
        toast.success('Question created. Now, fund the bounty.');
        } catch (error: any) {
        toast.error(error.message || 'Failed to create question');
        }
        setIsLoading(false);
    };

    const handleFundQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletAddress || !questionId) return;

        if (!program) { 
        toast.error("Program is not initialized. Please wait a moment or reconnect your wallet.");
        return;
    }

        setIsLoading(true);
        const lamports = parseFloat(bountyAmount) * LAMPORTS_PER_SOL;
        if (isNaN(lamports) || lamports <= 0) {
        toast.error('Invalid bounty amount');
        setIsLoading(false);
        return;
        }
        const bountyAmountBN = new BN(Math.floor(lamports));
        console.log('--- DEBUG ---');
        console.log('Sending questionId:', questionId);
        console.log('Calculated lamports:', lamports);
        console.log('BN being sent:', bountyAmountBN);
        console.log('BN as number:', bountyAmountBN.toNumber());
        console.log('BN CONSTRUCTOR:', bountyAmountBN.constructor.name);
        console.log('--- END DEBUG ---');

        try {
        // Step 1: Call Solana program
        const { txSignature, bountyPda } = await postBounty(questionId, bountyAmountBN);
        toast.success(`Bounty posted! TX: ${txSignature.substring(0, 10)}...`);

        // Step 2: Confirm funding with our backend
        await questionApi.fundQuestion(
            questionId,
            bountyPda.toBase58(),
            lamports,
            walletAddress
        );
        toast.success('Question is now live!');
        router.push(`/questions/${questionId}`);
        } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Failed to fund bounty');
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border-4 border-black pixel-shadow-lg">
            {step === 1 && (
            <>
                <div className="border-b-4 border-black p-5 bg-so-light-gray">
                <h1 className="pixel-text text-xl font-black text-so-black">
                    Step 1: Ask Your Question
                </h1>
                </div>
                <form onSubmit={handleCreateQuestion} className="p-8 space-y-6">
                <div>
                    <label htmlFor="title" className="pixel-text text-sm font-bold text-so-black">
                    Title
                    </label>
                    <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to fix '_bn' error in Anchor?"
                    required
                    className="w-full mt-2 border-3 border-black px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-so-orange pixel-text bg-white"
                    />
                </div>
                <div>
                    <label htmlFor="link" className="pixel-text text-sm font-bold text-so-black">
                    Description Link (Optional)
                    </label>
                    <input
                    id="link"
                    value={descriptionLink}
                    onChange={(e) => setDescriptionLink(e.target.value)}
                    placeholder="Link to GitHub Gist, repository, etc."
                    className="w-full mt-2 border-3 border-black px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-so-orange pixel-text bg-white"
                    />
                </div>
                <button type="submit" className="pixel-button bg-so-orange text-white py-3 px-6 text-sm" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Next: Set Bounty'}
                </button>
                </form>
            </>
            )}

            {step === 2 && (
            <>
                <div className="border-b-4 border-black p-5 bg-so-light-gray">
                <h1 className="pixel-text text-xl font-black text-so-black">
                    Step 2: Fund Your Bounty
                </h1>
                </div>
                <form onSubmit={handleFundQuestion} className="p-8 space-y-6">
                <div>
                    <span className="pixel-text text-sm font-bold text-so-black">Question:</span>
                    <p className="font-mono text-so-dark-gray mt-1">{title}</p>
                </div>
                <div>
                    <label htmlFor="bounty" className="pixel-text text-sm font-bold text-so-black">
                    Bounty Amount (SOL)
                    </label>
                    <input
                    id="bounty"
                    type="number"
                    step="0.01"
                    value={bountyAmount}
                    onChange={(e) => setBountyAmount(e.target.value)}
                    required
                    className="w-full mt-2 border-3 border-black px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-so-orange pixel-text bg-white"
                    />
                </div>
                <button type="submit" className="pixel-button bg-so-green text-white py-3 px-6 text-sm" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Fund & Post Question'}
                </button>
                </form>
            </>
            )}
        </div>
        </div>
    );
}