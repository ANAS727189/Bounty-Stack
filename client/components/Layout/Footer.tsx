import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="bg-so-orange border-3 border-black inline-block px-4 py-2 pixel-shadow-sm mb-4">
              <h3 className="pixel-text text-sm text-white">BOUNTYSTACK</h3>
            </div>
            <p className="font-mono text-so-dark-gray text-sm leading-relaxed">
              The Q&A platform where developers earn SOL for solving problems.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://x.com/Anas_is_me" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-so-yellow border-2 border-black hover:bg-so-orange hover:text-white transition-colors flex items-center justify-center pixel-shadow-sm">
                <span className="text-so-black">𝕏</span>
              </a>
              <a href="https://github.com/ANAS727189" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-so-yellow border-2 border-black hover:bg-so-orange hover:text-white transition-colors flex items-center justify-center pixel-shadow-sm">
                <span className="text-so-black">⚡</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-so-yellow border-2 border-black hover:bg-so-orange hover:text-white transition-colors flex items-center justify-center pixel-shadow-sm">
                <span className="text-so-black">◆</span>
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="pixel-text text-xs text-so-orange mb-4">PLATFORM</h4>
            <ul className="space-y-3">
              {['Browse Bounties', 'Ask Question', 'How It Works', 'Leaderboard'].map((item) => (
                <li key={item}>
                  <Link href="/dashboard" className="font-mono text-so-dark-gray text-sm hover:text-so-orange transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="pixel-text text-xs text-so-orange mb-4">RESOURCES</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Smart Contract', 'Blog'].map((item) => (
                <li key={item}>
                  <Link href="/" className="font-mono text-so-dark-gray text-sm hover:text-so-orange transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="pixel-text text-xs text-so-orange mb-4">COMPANY</h4>
            <ul className="space-y-3">
              {['About', 'Terms', 'Privacy', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="/" className="font-mono text-so-dark-gray text-sm hover:text-so-orange transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t-3 border-black mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-so-green border-2 border-black pixel-shadow-sm"></div>
            <p className="font-mono text-so-dark-gray text-xs">
              Powered by Solana
            </p>
          </div>

          <div className="text-center md:text-left">
            <p className="pixel-text text-xs text-so-dark-gray">
              © 2025 BOUNTYSTACK
            </p>
            <p className="font-mono text-xs text-so-gray mt-1">
              Built with ❤️ by Anas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-so-orange border-2 border-black pixel-shadow-sm animate-pulse"></div>
            <p className="font-mono text-so-dark-gray text-xs">
              All transactions on-chain
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer