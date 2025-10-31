# BountyStack

<p align="center">
  <strong>A decentralized question and answer platform built on Solana that enables direct monetary incentives for expert knowledge through on-chain bounties and trustless escrow.</strong>
</p>

<p align="center">
  <a href="https://github.com/ANAS727189/Bounty-Stack">
    <img src="https://img.shields.io/github/stars/ANAS727189/Bounty-Stack?style=social" alt="GitHub stars" />
  </a>
  <a href="https://github.com/ANAS727189/Bounty-Stack/fork">
    <img src="https://img.shields.io/github/forks/ANAS727189/Bounty-Stack?style=social" alt="GitHub forks" />
  </a>
  <a href="https://github.com/ANAS727189/Bounty-Stack/issues">
    <img src="https://img.shields.io/github/issues/ANAS727189/Bounty-Stack" alt="GitHub issues" />
  </a>
  <a href="https://github.com/ANAS727189/Bounty-Stack/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/ANAS727189/Bounty-Stack" alt="License" />
  </a>
  <a href="https://github.com/ANAS727189/Bounty-Stack/pulls">
    <img src="https://img.shields.io/github/issues-pr/ANAS727189/Bounty-Stack" alt="Pull Requests" />
  </a>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

BountyStack is a Web3-native Q&A platform that fundamentally reimagines how knowledge exchange is incentivized. By leveraging Solana smart contracts, the platform enables users to attach SOL bounties to questions, with funds held in trustless escrow and automatically distributed to experts who provide accepted answers.

## Key Features

- **Trustless Escrow**: SOL bounties are locked in smart contract-controlled Program Derived Addresses, eliminating counterparty risk
- **Instant Settlement**: Automated fund distribution through atomic on-chain transactions
- **Transparent Marketplace**: Open competition where experts can browse and compete for active bounties
- **Low Transaction Costs**: Built on Solana for fast, affordable blockchain interactions
- **Wallet Integration**: Seamless connection with popular Solana wallets
- **Reputation System**: Track expertise and build credibility through answered bounties
- **Real-time Updates**: Live notifications for new questions, answers, and bounty awards

## Problem Statement

Traditional Q&A platforms rely on reputation systems and voluntary contributions, which often fail to incentivize responses for:

- Complex, specialized technical problems
- Time-sensitive business-critical questions
- Niche domains with limited expert availability
- High-value consulting-level expertise

These platforms lack native mechanisms for offering and guaranteeing financial compensation for high-quality answers, creating friction in knowledge markets where expertise has tangible value.

## Solution

BountyStack addresses these limitations through:

- **On-chain escrow**: SOL bounties are locked in smart contract-controlled Program Derived Addresses (PDAs), eliminating counterparty risk
- **Trustless settlement**: Automated fund distribution based on verifiable on-chain actions
- **Direct incentives**: Market-driven pricing for knowledge that reflects its true value
- **Transparent competition**: Open marketplace where experts compete on answer quality
- **Immutable records**: All transactions and awards permanently recorded on Solana blockchain

## Architecture

The platform consists of three core components working in harmony:

### Client (`/client`)
Next.js-based frontend application providing:
- Wallet integration via Solana Wallet Adapter
- Real-time question and bounty browsing
- Answer submission and bounty award interfaces
- State management with Zustand and data fetching via SWR
- Responsive design with TailwindCSS

### Server (`/server`)
Express.js API server handling:
- User authentication and profiles
- Question and answer metadata storage
- MongoDB integration for off-chain data
- Input validation with Zod schemas
- RESTful API endpoints for CRUD operations

### Smart Contracts (`/web3`)
Solana programs built with Anchor framework:
- Escrow account creation and management
- Bounty locking and distribution logic
- Authority verification for payouts
- Program deployment and testing infrastructure
- Security-audited Rust implementations

## Technical Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js, React, TailwindCSS, TypeScript |
| State Management | Zustand, SWR |
| Backend | Node.js, Express, MongoDB |
| Validation | Zod |
| Blockchain | Solana, Anchor, Rust |
| Web3 Integration | Solana Wallet Adapter, web3.js |
| Development | ESLint, Prettier, Nodemon |

## User Flow

### 1. Question Creation
User posts a question and specifies a SOL bounty amount. Upon submission, funds are transferred from their wallet to a newly created escrow PDA unique to that question. The escrow account is deterministically derived and cannot be tampered with.

### 2. Answer Submission
Experts browse active bounties filtered by category, bounty amount, and recency. They submit detailed answers, which are stored off-chain with cryptographic references to the on-chain bounty for verification.

### 3. Award Distribution
Question author reviews submitted answers and selects the best response. This triggers a smart contract instruction that:
- Validates the author's signing authority
- Verifies the answer recipient's wallet address
- Transfers the full bounty from escrow to the winner
- Closes the escrow account and returns rent to the question author
- Emits an event log for indexing and notifications

All operations occur atomically, ensuring either complete success or complete rollback.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 18+ and npm/pnpm
- Rust 1.70+ and Cargo
- Anchor CLI 0.28+
- Solana CLI 1.16+
- MongoDB 6.0+
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/ANAS727189/Bounty-Stack.git
cd Bounty-Stack
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
```

Configure your `.env` file:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PROGRAM_ID=your_program_id
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd server
pnpm install
cp .env.example .env
```

Configure your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/bountystack
PORT=3001
JWT_SECRET=your_jwt_secret
SOLANA_RPC_URL=https://api.devnet.solana.com
```

Start the API server:
```bash
pnpm dev
```

The API will be available at `http://localhost:3001`

### Smart Contract Setup

```bash
cd web3
npm install
```

Build the program:
```bash
anchor build
```

Run tests:
```bash
anchor test
```

Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

Update the program ID in your frontend and backend configurations.

## Documentation

### API Documentation

The REST API exposes the following endpoints:

- `POST /api/users/register` - Create new user account
- `POST /api/users/login` - Authenticate user
- `GET /api/questions` - List all questions with pagination
- `POST /api/questions` - Create new question
- `GET /api/questions/:id` - Get question details
- `POST /api/answers` - Submit answer to question
- `GET /api/answers/:questionId` - Get all answers for question

### Smart Contract Interface

Key program instructions:

- `initialize_bounty` - Create escrow and lock SOL
- `submit_answer` - Register answer submission
- `award_bounty` - Transfer funds to winner
- `cancel_bounty` - Return funds to asker (if no valid answers)

Refer to `/web3/programs/bountystack/src/lib.rs` for complete IDL.

## Project Structure

```
Bounty-Stack/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand state management
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Helper functions
│   └── tests/             # API tests
└── web3/                  # Solana programs
    ├── programs/          # Anchor programs
    ├── tests/             # Program tests
    └── migrations/        # Deployment scripts
```

## Development

### Running Tests

Frontend:
```bash
cd client
npm test
```

Backend:
```bash
cd server
pnpm test
```

Smart Contracts:
```bash
cd web3
anchor test
```

### Code Quality

We use ESLint and Prettier for code formatting:

```bash
npm run lint
npm run format
```

### Building for Production

Frontend:
```bash
cd client
npm run build
npm start
```

Backend:
```bash
cd server
pnpm build
pnpm start
```

## Deployment

### Frontend Deployment (Vercel)

```bash
vercel --prod
```

### Backend Deployment (Render)

Configure environment variables and deploy using your preferred platform.

### Smart Contract Deployment (Mainnet)

```bash
anchor deploy --provider.cluster mainnet
```

Note: Ensure thorough testing and security audits before mainnet deployment.


## Community

- GitHub Discussions: [Ask questions and share ideas](https://github.com/ANAS727189/Bounty-Stack/discussions)
- Issue Tracker: [Report bugs](https://github.com/ANAS727189/Bounty-Stack/issues)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with support from the Solana developer community and inspired by the need for trustless knowledge markets in Web3.

---

<p align="center">
  Made with ⚡ on Solana
</p>

<p align="center">
  <a href="https://github.com/ANAS727189/Bounty-Stack">Star this repository</a> if you find it helpful!
</p>