export const SocialProofSection = () => {
  return (
    <section className="w-full bg-so-yellow py-20 sm:py-24 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="pixel-text text-3xl sm:text-4xl font-black text-so-black mb-4">
            DEVS LOVE IT
          </h2>
          <p className="font-mono text-lg text-so-gray">
            Real developers. Real problems solved. Real money earned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "Posted a Rust bug with 2 SOL bounty. Got 3 solutions in 45 minutes. Worth every penny.",
              author: "Sarah K.",
              role: "Backend Dev",
              earned: false
            },
            {
              quote: "Made $340 in SOL this month just answering React questions. Better than freelance platforms.",
              author: "Mike R.",
              role: "Frontend Dev",
              earned: true
            },
            {
              quote: "Finally a platform where my expertise is valued immediately. No waiting for upvotes or badges.",
              author: "Alex T.",
              role: "Solana Dev",
              earned: true
            }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white border-4 border-black pixel-shadow-lg p-6">
              <div className="mb-4">
                <span className="pixel-text text-so-orange text-2xl">"</span>
              </div>
              <p className="font-mono text-so-dark-gray mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="pixel-text text-sm text-so-black">{testimonial.author}</p>
                  <p className="font-mono text-xs text-so-gray mt-1">{testimonial.role}</p>
                </div>
                {testimonial.earned && (
                  <div className="bg-so-green border-2 border-black px-3 py-1">
                    <span className="pixel-text text-white text-xs">EARNER</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}