export const DifferentiatorSection = () => {
  return (
    <section className="w-full bg-so-yellow py-20 sm:py-24 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Problems */}
          <div className="space-y-6">
            <div className="inline-block bg-so-red border-3 border-black px-4 py-2 pixel-shadow-sm mb-4">
              <span className="pixel-text text-xs text-white">OLD WAY</span>
            </div>
            <h3 className="pixel-text text-2xl sm:text-3xl font-black text-so-black">
              TIRED OF THIS?
            </h3>
            
            <div className="space-y-4">
              {[
                "Post on Stack Overflow, get ghosted",
                "Wait days for a response that may never come",
                "No incentive for experts to prioritize your problem",
                "Reputation points don't pay the bills"
              ].map((problem, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border-3 border-black p-4 pixel-shadow-sm">
                  <span className="pixel-text text-so-red text-xl">✕</span>
                  <p className="font-mono text-so-dark-gray">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Solutions */}
          <div className="space-y-6">
            <div className="inline-block bg-so-green border-3 border-black px-4 py-2 pixel-shadow-sm mb-4">
              <span className="pixel-text text-xs text-white">NEW WAY</span>
            </div>
            <h3 className="pixel-text text-2xl sm:text-3xl font-black text-so-black">
              DO THIS INSTEAD
            </h3>
            
            <div className="space-y-4">
              {[
                "Attach a bounty, get instant attention",
                "Experts compete to solve your problem fast",
                "Higher bounties = better developers",
                "Real money, real motivation, real results"
              ].map((solution, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border-3 border-black p-4 pixel-shadow-sm">
                  <span className="pixel-text text-so-green text-xl">✓</span>
                  <p className="font-mono text-so-dark-gray">{solution}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}