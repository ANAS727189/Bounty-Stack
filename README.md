# BountyStack: The Web3 Stack Overflow

BountyStack is a decentralized Q&A platform on Solana that transforms knowledge into a monetizable asset. It directly connects users needing answers with experts who can provide them, using trustless crypto bounties as the core financial incentive.

---

## Table of Contents
- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution-bountystack)
- [Architecture](#architecture)
- [User Journey](#user-journey)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
BountyStack reimagines Q&A platforms by enabling users to post questions with SOL bounties, held in on-chain escrow. Experts compete to answer, and the best answer is rewarded automatically and trustlessly, without intermediaries.

## The Problem
Traditional Q&A platforms like Stack Overflow rely on altruism and gamified reputation points. This model breaks down for complex, niche, or business-critical problems where real expertise is valuable and time-sensitive. There is no native, trustless way to offer a financial reward for a high-quality answer and guarantee a payout.

## The Solution: BountyStack
BountyStack solves this with an on-chain smart contract that governs the entire financial flow, removing the need for a trusted intermediary.

## Architecture
- **client/**: Next.js frontend for user interaction, wallet connection, and on-chain/off-chain data display.
- **server/**: Node.js/Express backend API for user, question, and answer management, using MongoDB.
- **web3/**: Solana smart contracts (Anchor framework) for escrow logic, migrations, and tests.

## User Journey
1. **Ask & Fund**: A user posts a question and attaches a SOL bounty. The funds are immediately transferred from their wallet and locked in a unique, on-chain escrow account (PDA) tied to that question.
2. **Answer & Compete**: Experts browse open bounties and submit their solutions, competing to provide the best possible answer.
3. **Award & Payout**: The asker selects the winning answer, triggering the smart contract to verify authority and instantly transfer the bounty from escrow to the winner's wallet.

## Tech Stack
- **Frontend**: Next.js, React, Zustand, SWR, TailwindCSS, Solana Wallet Adapter
- **Backend**: Node.js, Express, MongoDB, Zod
- **Smart Contracts**: Solana, Anchor (Rust)

## Getting Started
1. **Clone the repository**
   ```bash
   git clone https://github.com/ANAS727189/Bounty-Stack.git
   ```
2. **Install dependencies**
   - Frontend:
     ```bash
     cd client
     npm install
     # or pnpm install
     ```
   - Backend:
     ```bash
     cd ../server
     pnpm install
     ```
   - Web3:
     ```bash
     cd ../web3
     npm install
     # Rust/Anchor setup required
     ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` in each folder and fill in required values.
4. **Run the app**
   - Start backend:
     ```bash
     pnpm dev
     ```
   - Start frontend:
     ```bash
     npm run dev
     ```

## License
This project is licensed under the MIT License.
