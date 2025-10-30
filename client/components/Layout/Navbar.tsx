"use client";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import '@/styles/Navbar.css';
import { useUserStore } from "@/hooks/useUserStore"; 
import Link from "next/link";

export default function Navbar() {
    const { publicKey, connected } = useWallet();

    const {
        username: displayName, 
        reputation,
        showUsernamePrompt,
        isLoading: loading,
        login,
        register,
        logout,
        closePrompt
    } = useUserStore();

    const [localUsername, setLocalUsername] = useState("");

    useEffect(() => {
        if (connected && publicKey) {
            login(publicKey.toBase58());
        } else {
            logout();
        }
    }, [connected, publicKey, login, logout]); 

    async function handleRegister() {
        if (!localUsername.trim()) {
            alert("⚠️ Username required!");
            return;
        }
        await register(localUsername);
        setLocalUsername(""); 
    }

    return (
        <div className="relative">
            {/* Main Navbar */}
            <nav className="border-b-4 border-black bg-so-orange pixel-shadow">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Section*/}
                        <div className="flex items-center gap-3">
                            <Link href="/">
                            <div className="relative flex space-x-2">
                                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight pixel-text leading-tight">
                                    BOUNTY
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-so-black tracking-tight pixel-text leading-tight">
                                    STACK
                                </div>
                            </div>
                            </Link>
                            <div className="w-10 h-10 bg-so-black border-3 border-black rotate-45 pixel-shadow-sm hidden sm:block"></div>
                        </div>

                        {/* Right Side: User Info & Wallet (No changes needed, reads from store) */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {connected && displayName && reputation !== null && (
                                <div className="hidden md:flex items-center gap-3 bg-white border-3 border-black px-4 py-2 pixel-shadow-sm hover:pixel-shadow transition-all">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs sm:text-sm font-bold text-so-black pixel-text">
                                            @{displayName}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-so-orange border border-black"></div>
                                                <span className="text-xs font-bold text-so-gray">
                                                    {reputation}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {connected && displayName && (
                                <div className="md:hidden flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 pixel-shadow-sm">
                                    <span className="text-xs font-bold text-so-black pixel-text">
                                        @{displayName}
                                    </span>
                                    <div className="w-2 h-2 bg-so-orange border border-black"></div>
                                    <span className="text-xs font-bold text-so-gray">
                                        {reputation}
                                    </span>
                                </div>
                            )}
                            <div className="pixelated-wallet-button">
                                <WalletMultiButton />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Username Registration Modal*/}
            {showUsernamePrompt && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" 
                        onClick={() => !loading && closePrompt()} 
                    />
                    
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md">
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            {/* Modal Header*/}
                            <div className="bg-so-orange border-b-4 border-black px-6 py-5">
                                <h3 className="text-lg sm:text-xl font-black text-white pixel-text leading-tight">
                                    WELCOME ANON! 🎮
                                </h3>
                                <p className="text-xs text-white mt-2 opacity-90">
                                    Join the blockchain bounty revolution
                                </p>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="p-6 sm:p-8">
                                <p className="text-xs sm:text-sm font-bold text-so-black mb-5 pixel-text leading-relaxed">
                                    Choose your username to start earning bounties:
                                </p>
                                
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={localUsername}
                                        onChange={(e) => setLocalUsername(e.target.value)}
                                        className="w-full border-3 border-black px-4 py-3 sm:py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-so-orange pixel-text bg-white"
                                        placeholder="username"
                                        maxLength={30}
                                        disabled={loading}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !loading) {
                                                handleRegister();
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-so-gray mt-2 font-mono">
                                        Max 30 characters • No spaces
                                    </p>
                                </div>
                                
                                <button
                                    disabled={loading || !localUsername.trim()}
                                    onClick={handleRegister}
                                    className="w-full bg-so-orange border-3 border-black text-white font-black py-3 sm:py-4 pixel-text text-xs sm:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                                >
                                    {loading ? "SAVING..." : "LET'S GO! →"}
                                </button>

                                <div className="mt-5 border-3 border-so-light-gray bg-so-yellow p-4">
                                    <p className="text-xs text-so-dark-gray font-bold">
                                        💡 TIP: Choose wisely! Your username will be visible to all users.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}