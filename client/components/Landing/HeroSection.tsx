import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HeroSection = () => {
  return (
    <section className="w-full bg-so-yellow py-16 sm:py-24 border-b-4 border-black">
      <div className="max-w-8xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-block bg-so-orange border-3 border-black px-4 py-2 pixel-shadow-sm">
              <span className="pixel-text text-xs text-white">SOLANA POWERED</span>
            </div>
            
            <h1 className="pixel-text text-4xl sm:text-5xl lg:text-6xl font-black text-so-black leading-tight">
              ASK.SOLVE.<br/>
              EARN.
            </h1>
            
            <p className="font-mono text-lg sm:text-xl text-so-dark-gray leading-relaxed max-w-lg">
              Post technical questions with SOL bounties. Get expert answers. Payments secured on-chain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/dashboard"
                className="pixel-button bg-so-orange text-white text-sm sm:text-base py-4 px-8 text-center"
              >
                Browse Bounties
              </Link>
              <Link
                href="/dashboard"
                className="pixel-button bg-so-black text-white text-sm sm:text-base py-4 px-8 text-center"
              >
                Ask Question
              </Link>
            </div>

            {/* Simple trust indicators */}
            <div className="flex items-center gap-6 pt-8">
              <div className="font-mono text-so-gray text-sm">
                <span className="pixel-text text-so-orange text-xl">◆</span> Escrow Protected
              </div>
              <div className="font-mono text-so-gray text-sm">
                <span className="pixel-text text-so-green text-xl">◆</span> Instant Payouts
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="bg-white border-4 border-black pixel-shadow-xl p-8">
              <Image
                src="/hero-section-1.png"
                alt="Stack Overflow Bounties Platform"
                width={500}
                height={300}
                className="w-full h-auto"
              />
            </div>
            
            {/* Decorative pixel elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-so-blue border-3 border-black"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-so-green border-3 border-black"></div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection