import React from 'react'

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
  <div className="bg-white border-4 border-black pixel-shadow-lg p-8 h-full hover:translate-x-1 hover:translate-y-1 hover:pixel-shadow transition-all duration-100">
    <div className="w-16 h-16 bg-so-yellow border-3 border-black flex items-center justify-center mb-6 pixel-shadow-sm">
      <span className="text-3xl">{icon}</span>
    </div>
    <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
      {title}
    </h3>
    <p className="font-mono text-so-dark-gray leading-relaxed">
      {description}
    </p>
  </div>
);

// Feature Section
export const FeatureSection = () => {
  return (
    <section className="w-full bg-white py-20 sm:py-24 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-so-blue border-3 border-black px-4 py-2 pixel-shadow-sm mb-6">
            <span className="pixel-text text-xs text-white">HOW IT WORKS</span>
          </div>
          <h2 className="pixel-text text-3xl sm:text-4xl font-black text-so-black">
            WEB2 SPEED.<br/>WEB3 TRUST.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="❓"
            title="POST & FUND"
            description="Ask your technical question. Set a SOL bounty. Your funds lock in an escrow smart contract instantly."
          />
          <FeatureCard 
            icon="💡"
            title="GET ANSWERS"
            description="Developers compete to solve your problem. Vote on answers. Community helps you find the best solution."
          />
          <FeatureCard 
            icon="⚡"
            title="PAY INSTANTLY"
            description="Award the winner with one click. Funds transfer on-chain automatically. No middlemen, no delays."
          />
        </div>
      </div>
    </section>
  )
}

export default FeatureSection;