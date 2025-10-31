use anchor_lang::prelude::*;

use anchor_lang::system_program::{self, Transfer};



// This is your program's public key.

// Solana Playground will automatically update this for you when you build.

declare_id!("BAZdzAroYAZYNrt8PxpxbvrA87wdMighpPSzS4NcDaYY");



#[program]

pub mod bounty_escrow {

use super::*;



/// INSTRUCTION 1: POST A NEW BOUNTY

/// Creates a new bounty escrow account (a PDA) and funds it with SOL.

pub fn post_bounty(

ctx: Context<PostBounty>,

question_id: String,

bounty_amount: u64,

) -> Result<()> {

// 1. --- Fund the new bounty account ---

// This transfers SOL from the asker's wallet to the new PDA

let cpi_context = CpiContext::new(

ctx.accounts.system_program.to_account_info(),

Transfer {

from: ctx.accounts.asker.to_account_info(),

to: ctx.accounts.bounty_account.to_account_info(),

},

);

system_program::transfer(cpi_context, bounty_amount)?;



// 2. --- Set the data on the new bounty account ---

let bounty = &mut ctx.accounts.bounty_account;

bounty.asker = *ctx.accounts.asker.key;

bounty.bounty_amount = bounty_amount;

bounty.question_id = question_id.clone();

bounty.state = BountyState::Open;

bounty.bump = ctx.bumps.bounty_account;



msg!("Bounty posted for question: {}. Amount: {} lamports", question_id, bounty_amount);

Ok(())

}



// --- CORRECTED award_bounty function ---
    pub fn award_bounty(
        ctx: Context<AwardBounty>,
        question_id: String,
    ) -> Result<()> {
        require!(ctx.accounts.bounty_account.state == BountyState::Open, BountyError::BountyNotOpen);

        let bounty = &mut ctx.accounts.bounty_account;
        let amount_to_transfer = bounty.bounty_amount;

        // --- Direct Lamport Transfer ---
        // 1. Debit lamports from the PDA
        **bounty.to_account_info().try_borrow_mut_lamports()? -= amount_to_transfer;
        // 2. Credit lamports to the winner
        **ctx.accounts.winner.to_account_info().try_borrow_mut_lamports()? += amount_to_transfer;
        // --- End Direct Lamport Transfer ---

        bounty.state = BountyState::Awarded;

        // The `close = asker` constraint still handles refunding the rent
        msg!("Bounty for {} awarded to {}. Account closed.", question_id, ctx.accounts.winner.key());
        Ok(())
    }

    // --- CORRECTED cancel_bounty function ---
    pub fn cancel_bounty(ctx: Context<CancelBounty>, question_id: String) -> Result<()> {
        require!(ctx.accounts.bounty_account.state == BountyState::Open, BountyError::BountyNotOpen);

        let bounty = &mut ctx.accounts.bounty_account;
        let amount_to_transfer = bounty.bounty_amount;

        // --- Direct Lamport Transfer ---
        // 1. Debit lamports from the PDA
        **bounty.to_account_info().try_borrow_mut_lamports()? -= amount_to_transfer;
        // 2. Credit lamports back to the asker
        **ctx.accounts.asker.to_account_info().try_borrow_mut_lamports()? += amount_to_transfer;
        // --- End Direct Lamport Transfer ---

        bounty.state = BountyState::Cancelled;

        // The `close = asker` constraint still handles refunding the rent
        msg!("Bounty for {} cancelled. Funds returned. Account closed.", question_id);
        Ok(())
    }
}

// =================================================================

// 1. ACCOUNTS FOR: post_bounty

// =================================================================

#[derive(Accounts)]

#[instruction(question_id: String)] // The Web2 ID

pub struct PostBounty<'info> {

#[account(

init, // This instruction will *create* this account

payer = asker, // The `asker` pays the rent for this account


// The PDA is seeded with "bounty" and the unique question_id

seeds = [b"bounty", question_id.as_bytes()],

bump, // Anchor will find and store the bump seed



// Calculate the space needed.

// 8 bytes (discriminator)

// 32 bytes (asker Pubkey)

// 8 bytes (bounty_amount u64)

// (4 + 64 bytes) (String prefix + 64 bytes for the ID)

// 1 byte (state enum)

// 1 byte (bump)

space = 8 + 32 + 8 + (4 + 64) + 1 + 1

)]

pub bounty_account: Account<'info, BountyAccount>,



#[account(mut)]

pub asker: Signer<'info>, // The person posting the question (and signing)



pub system_program: Program<'info, System>, // Required by Anchor to create accounts

}



// =================================================================

// 2. ACCOUNTS FOR: award_bounty

// =================================================================

#[derive(Accounts)]

#[instruction(question_id: String)] // Must pass question_id to re-find the PDA

pub struct AwardBounty<'info> {

#[account(

mut, // We are changing its state and closing it


// Find the PDA using the same seeds

seeds = [b"bounty", question_id.as_bytes()],

bump = bounty_account.bump, // Verify the bump



// Security: Ensure the signer is the original asker

has_one = asker @ BountyError::Unauthorized,


// When this instruction finishes, close the account

// and send the remaining rent SOL to the `asker`.

close = asker

)]

pub bounty_account: Account<'info, BountyAccount>,



#[account(mut)]

pub asker: Signer<'info>, // The original asker (must sign)


/// CHECK: This is the wallet we are sending the bounty to.

/// It's 'mut' because it's receiving SOL.

#[account(mut)]

pub winner: AccountInfo<'info>,



pub system_program: Program<'info, System>, // Required for the SOL transfer

}



// =================================================================

// 3. ACCOUNTS FOR: cancel_bounty

// =================================================================

#[derive(Accounts)]

#[instruction(question_id: String)] // Must pass question_id to re-find the PDA

pub struct CancelBounty<'info> {

#[account(

mut,

seeds = [b"bounty", question_id.as_bytes()],

bump = bounty_account.bump,


// Security: Only the original asker can cancel

has_one = asker @ BountyError::Unauthorized,


// Close the account and refund rent to the `asker`

close = asker

)]

pub bounty_account: Account<'info, BountyAccount>,



#[account(mut)]

pub asker: Signer<'info>, // The original asker (must sign)


pub system_program: Program<'info, System>, // Required for the SOL transfer

}



// =================================================================

// DATA STRUCTURES & ERRORS

// =================================================================



/// This is the main data account that holds the escrowed SOL

#[account]

pub struct BountyAccount {

/// The wallet of the person who posted the question.

pub asker: Pubkey,

/// The amount of SOL (in lamports) to be paid out.

pub bounty_amount: u64,

/// The unique ID from the Web2 backend (e.g., "q_uuid123").

pub question_id: String,

/// The state of the bounty (Open, Awarded, Cancelled).

pub state: BountyState,

/// The bump seed for the PDA.

pub bump: u8,

}



/// The state of the bounty

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]

pub enum BountyState {

Open,

Awarded,

Cancelled,

}



/// Custom errors for our program

#[error_code]

pub enum BountyError {

#[msg("This bounty has already been awarded or cancelled.")]

BountyNotOpen,

#[msg("You are not the original asker and cannot perform this action.")]

Unauthorized,

}