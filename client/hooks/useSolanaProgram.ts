import { useMemo } from 'react';
import {
    useAnchorWallet,
    useConnection,
} from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { BountyEscrow, idl } from '@/lib/idl';
import { toast } from 'sonner';

const PROGRAM_ID = new PublicKey('BAZdzAroYAZYNrt8PxpxbvrA87wdMighpPSzS4NcDaYY');

export const useSolanaProgram = () => {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const provider = useMemo(() => {
        if (wallet) {
            return new anchor.AnchorProvider(connection, wallet, {
                preflightCommitment: 'processed',
            });
        }
        return null;
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (provider) {
            console.log('Imported IDL:', idl); 
            if (!idl) {
                console.error("IDL IS UNDEFINED. Check your import from '@/lib/idl'.");
                return null;
            }
            
            const idl_copy = JSON.parse(JSON.stringify(idl));

            // Create a lookup map of all type definitions
            const typesMap = new Map(
                (idl_copy.types || []).map((t: any) => [t.name, t.type])
            );

            // Find the main "BountyAccount" type from the types array
            const bountyAccountType = typesMap.get('BountyAccount');

            // FIX #2 (pubkey) & FIX #3 (defined)
            if (bountyAccountType && bountyAccountType.fields) {
                bountyAccountType.fields = bountyAccountType.fields.map((field: any) => {
                    if (field.type === 'pubkey') {
                        return { ...field, type: 'publicKey' };
                    }
                    if (field.type && field.type.defined && typeof field.type.defined === 'object') {
                        return { ...field, type: { defined: field.type.defined.name } };
                    }
                    return field;
                });
            }
            
            // FIX #1: Manually patch the 'accounts' array
            const fixed_accounts = (idl_copy.accounts || []).map((acc: any) => {
                if (acc.name === 'BountyAccount' && bountyAccountType) {
                    return {
                        ...acc,
                        type: bountyAccountType, 
                    };
                }
                return acc;
            });

            // FIX #4: Remove PDA definitions from instructions
            (idl_copy.instructions || []).forEach((ix: any) => {
                (ix.accounts || []).forEach((acc: any) => {
                    if (acc.pda) {
                        delete acc.pda;
                    }
                });
            });

            // Create the final, patched IDL
            const fixedIdl = {
                ...idl_copy,
                accounts: fixed_accounts,
            } as anchor.Idl;

            console.log('Fixed IDL:', fixedIdl);
            
            try {
                const programInstance = new anchor.Program<BountyEscrow>(
                    fixedIdl,
                    PROGRAM_ID,
                    provider,
                );
                return programInstance;
            } catch (err) {
                console.error('Failed to construct Anchor Program:', err);
                return null;
            }
        }
        return null;
    }, [provider]);

    // --- 1. POST BOUNTY ---
    const postBounty = async (
        questionId: string,
        bountyAmount: anchor.BN
    ): Promise<{ txSignature: string; bountyPda: PublicKey }> => {
        if (!program || !wallet || !provider) throw new Error('Wallet not connected or program not initialized');

        const [bountyPda] = PublicKey.findProgramAddressSync(
            [Buffer.from('bounty'), Buffer.from(questionId)],
            program.programId
        );

        toast.info('Sending transaction... Please approve in your wallet.');

        // Build instruction manually with correct discriminator from IDL
        const discriminator = Buffer.from([40, 217, 222, 103, 151, 83, 147, 130]);
        
        // Encode arguments: question_id (string) and bounty_amount (u64)
        const questionIdBuffer = Buffer.from(questionId);
        const questionIdLengthBuffer = Buffer.alloc(4);
        questionIdLengthBuffer.writeUInt32LE(questionIdBuffer.length, 0);
        
        // Write u64 in little-endian format
        const bountyAmountBuffer = Buffer.alloc(8);
        const bn = bountyAmount.toArray('le', 8);
        for (let i = 0; i < 8; i++) {
            bountyAmountBuffer[i] = bn[i] || 0;
        }
        
        const data = Buffer.concat([
            discriminator,
            questionIdLengthBuffer,
            questionIdBuffer,
            bountyAmountBuffer
        ]);

        const instruction = new TransactionInstruction({
            keys: [
                { pubkey: bountyPda, isSigner: false, isWritable: true },
                { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId: program.programId,
            data,
        });

        const tx = new anchor.web3.Transaction().add(instruction);
        const txSignature = await provider.sendAndConfirm(tx);

        return { txSignature, bountyPda };
    };

    // --- 2. AWARD BOUNTY ---
    const awardBounty = async (
        questionId: string,
        winnerWallet: string
    ): Promise<{ txSignature: string }> => {
        if (!program || !wallet || !provider) throw new Error('Wallet not connected or program not initialized');

        const [bountyPda] = PublicKey.findProgramAddressSync(
            [Buffer.from('bounty'), Buffer.from(questionId)],
            program.programId
        );
        const winnerPublicKey = new PublicKey(winnerWallet);

        toast.info('Awaiting bounty award... Please approve in your wallet.');

        // Build instruction manually with correct discriminator from IDL
        const discriminator = Buffer.from([24, 150, 101, 41, 109, 41, 64, 114]);
        
        // Encode argument: question_id (string)
        const questionIdBuffer = Buffer.from(questionId);
        const questionIdLengthBuffer = Buffer.alloc(4);
        questionIdLengthBuffer.writeUInt32LE(questionIdBuffer.length, 0);
        
        const data = Buffer.concat([
            discriminator,
            questionIdLengthBuffer,
            questionIdBuffer
        ]);

        const instruction = new TransactionInstruction({
            keys: [
                { pubkey: bountyPda, isSigner: false, isWritable: true },
                { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
                { pubkey: winnerPublicKey, isSigner: false, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId: program.programId,
            data,
        });

        const tx = new anchor.web3.Transaction().add(instruction);
        const txSignature = await provider.sendAndConfirm(tx);

        return { txSignature };
    };

    return { program, provider, postBounty, awardBounty };
};