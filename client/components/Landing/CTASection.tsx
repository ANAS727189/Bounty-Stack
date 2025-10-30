import Link from 'next/link'
import React from 'react'

const CTASection = () => {
  return (
    <section className="w-full bg-so-black py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="pixel-text text-3xl sm:text-4xl font-black text-white">
          Ready to start?
        </h2>
        <p className="font-mono text-lg text-so-light-gray mt-4 mb-8">
          Explore active bounties or ask your first question.
        </p>
        <Link
          href="/dashboard"
          className="pixel-button bg-so-orange text-white text-base sm:text-lg py-4 px-10"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  )
}

export default CTASection