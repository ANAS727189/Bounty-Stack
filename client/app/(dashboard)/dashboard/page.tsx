"use client";
import Link from 'next/link';
import { useUserStore } from '@/hooks/useUserStore'; 

const page = () => {
      const { username, reputation } = useUserStore();
  return (
      <>
         <div className="w-full p-8">
      {/* 1. Header Section */}
      <div className="mb-10">
        <h1 className="pixel-text text-3xl sm:text-4xl font-black text-so-black">
          Welcome {username ? `back, @${username}` : 'to BountyStack'}!
        </h1>
        <p className="text-lg text-so-dark-gray mt-2 max-w-2xl font-mono">
          Find answers to your technical questions, help others, and get paid in crypto bounties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 2. Main Content Section */}
        <div className="md:col-span-2">
          {/* "How it Works" Card */}
          <div className="bg-white border-4 border-black pixel-shadow-lg p-6 sm:p-8 h-full">
            <h2 className="pixel-text text-xl sm:text-2xl font-bold mb-5 text-so-black">
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-4 font-mono text-so-dark-gray text-sm sm:text-base">
              <li>Ask a question and fund it with a SOL bounty.</li>
              <li>Developers submit answers to compete for the prize.</li>
              <li>Mark the best answer as correct to award the bounty.</li>
              <li>Build your reputation and earn crypto!</li>
            </ol>
            <Link 
              href="/questions" 
              className="pixel-button bg-so-orange text-white text-sm sm:text-base py-3 px-6 mt-8 inline-block"
            >
              Browse Bounties →
            </Link>
          </div>
        </div>

        {/* 3. Reputation Card Section */}
        <div className="md:col-span-1">
          {username ? (
            // --- Logged-In State: Reputation Card ---
            <div className="bg-white border-4 border-black pixel-shadow-lg p-6 h-full">
              <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
                Your Status
              </h3>
              
              {/* Reputation Display */}
              <div>
                <div className="pixel-text text-xs uppercase text-so-gray">
                  Reputation
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 bg-so-orange border-3 border-black"></div>
                  <div className="pixel-text text-4xl font-bold text-so-black">
                    {reputation}
                  </div>
                </div>
              </div>

              {/* Ask Question Button */}
              <Link 
                href="/ask"
                className="pixel-button bg-so-green text-white text-xs sm:text-sm py-3 px-4 mt-6 w-full text-center block"
              >
                Ask a Question
              </Link>
            </div>
          ) : (
            // --- Logged-Out State: Get Started Card ---
            <div className="bg-so-yellow border-4 border-black pixel-shadow-lg p-6 h-full">
              <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
                Get Started!
              </h3>
              <p className="text-sm text-so-dark-gray mb-4 font-mono">
                Connect your wallet in the header to ask questions, post answers, and earn bounties.
              </p>
              <div className="w-12 h-12 bg-so-black border-3 border-black pixel-shadow-sm rotate-45 mt-6"></div>
            </div>
          )}
        </div>
      </div>
    </div>
      </>
  )
}

export default page