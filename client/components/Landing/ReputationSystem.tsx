export const ReputationSection = () => {
  return (
    <section className="w-full bg-white py-20 sm:py-24 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-block bg-so-green border-3 border-black px-4 py-2 pixel-shadow-sm mb-6">
              <span className="pixel-text text-xs text-white">REPUTATION</span>
            </div>
            <h2 className="pixel-text text-3xl sm:text-4xl font-black text-so-black mb-6">
              BUILD YOUR<br/>DEV BRAND
            </h2>
            <p className="font-mono text-lg text-so-dark-gray leading-relaxed mb-8">
              Every bounty you win is recorded on-chain. Build verifiable proof of expertise that follows you everywhere.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-so-orange border-3 border-black flex items-center justify-center pixel-shadow-sm">
                  <span className="pixel-text text-white text-xl">1</span>
                </div>
                <p className="font-mono text-so-dark-gray">Win bounties, earn on-chain badges</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-so-blue border-3 border-black flex items-center justify-center pixel-shadow-sm">
                  <span className="pixel-text text-white text-xl">2</span>
                </div>
                <p className="font-mono text-so-dark-gray">Climb leaderboards by expertise area</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-so-green border-3 border-black flex items-center justify-center pixel-shadow-sm">
                  <span className="pixel-text text-white text-xl">3</span>
                </div>
                <p className="font-mono text-so-dark-gray">Showcase wallet as dev portfolio</p>
              </div>
            </div>
          </div>

          <div className="bg-so-yellow border-4 border-black pixel-shadow-xl p-8">
            <div className="bg-white border-3 border-black p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="pixel-text text-sm text-so-black">TOP SOLVERS</span>
                <span className="font-mono text-so-gray text-sm">This Month</span>
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'dev_master', bounties: '12', sol: '45.2' },
                  { rank: 2, name: 'code_wizard', bounties: '9', sol: '38.7' },
                  { rank: 3, name: 'bug_hunter', bounties: '8', sol: '29.4' }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center gap-4 bg-so-yellow border-2 border-black p-3">
                    <span className="pixel-text text-so-orange">#{user.rank}</span>
                    <span className="font-mono text-so-black flex-1">{user.name}</span>
                    <div className="text-right">
                      <div className="font-mono text-so-black text-sm font-bold">{user.sol} SOL</div>
                      <div className="font-mono text-so-gray text-xs">{user.bounties} bounties</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="font-mono text-so-dark-gray text-center text-sm">
              Real earnings. Real reputation. All verifiable on-chain.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}