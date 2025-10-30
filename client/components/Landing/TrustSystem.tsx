export const TrustSection = () => {
  return (
    <section className="w-full bg-so-yellow py-20 sm:py-24 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-so-orange border-3 border-black px-4 py-2 pixel-shadow-sm mb-6">
            <span className="pixel-text text-xs text-white">SECURITY</span>
          </div>
          <h2 className="pixel-text text-3xl sm:text-4xl font-black text-so-black mb-6">
            YOUR MONEY.<br/>YOUR CONTROL.
          </h2>
          <p className="font-mono text-lg text-so-dark-gray max-w-2xl mx-auto">
            Built on Solana smart contracts. No centralized authority can touch your funds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white border-4 border-black pixel-shadow-lg p-8">
            <div className="w-12 h-12 bg-so-green border-3 border-black mb-6 pixel-shadow-sm"></div>
            <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
              SMART CONTRACT ESCROW
            </h3>
            <p className="font-mono text-so-dark-gray leading-relaxed">
              Bounties locked on-chain until you award. No platform can steal or freeze your SOL.
            </p>
          </div>

          <div className="bg-white border-4 border-black pixel-shadow-lg p-8">
            <div className="w-12 h-12 bg-so-blue border-3 border-black mb-6 pixel-shadow-sm"></div>
            <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
              TRANSPARENT HISTORY
            </h3>
            <p className="font-mono text-so-dark-gray leading-relaxed">
              Every transaction on Solana blockchain. Verify payments, track reputation, audit everything.
            </p>
          </div>

          <div className="bg-white border-4 border-black pixel-shadow-lg p-8">
            <div className="w-12 h-12 bg-so-orange border-3 border-black mb-6 pixel-shadow-sm"></div>
            <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
              NON-CUSTODIAL
            </h3>
            <p className="font-mono text-so-dark-gray leading-relaxed">
              Connect wallet, stay in control. We never hold your keys or access your funds.
            </p>
          </div>

          <div className="bg-white border-4 border-black pixel-shadow-lg p-8">
            <div className="w-12 h-12 bg-so-red border-3 border-black mb-6 pixel-shadow-sm"></div>
            <h3 className="pixel-text text-lg font-bold text-so-black mb-4">
              INSTANT SETTLEMENT
            </h3>
            <p className="font-mono text-so-dark-gray leading-relaxed">
              Award answer, funds transfer immediately. No 7-day holds or payment processing delays.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}