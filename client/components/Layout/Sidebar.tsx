"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`
            block w-full p-3 pixel-text text-xs font-bold text-so-black
            border-3 border-black
            ${isActive ? "bg-so-yellow" : "bg-white"}
            pixel-shadow-sm
            hover:bg-so-yellow hover:translate-x-0.5 hover:translate-y-0.5 hover:pixel-shadow
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all
        `}
        >
        {children}
        </Link>
    );
    };

    const Sidebar = () => {
    return (
        <aside 
        className="
            min-h-screen sticky top-0
            w-64 bg-white
            border-r-4 border-black
            p-6 overflow-y-auto
        "
        >
        <nav>
            <ul className="space-y-4">
            <li>
                <SidebarLink href="/dashboard">
                🏠 Home
                </SidebarLink>
            </li>
            <li>
                <SidebarLink href="/questions">
                ❓ Questions
                </SidebarLink>
            </li>
            <li>
                <SidebarLink href="/my-answers">
                ✏️ Your Answers
                </SidebarLink>
            </li>

            {/* "More" Section */}
            <li className="pt-6">
                <span className="pixel-text text-xs text-so-gray uppercase">
                More
                </span>
            </li>
            <li>
                <SidebarLink href="/tags">
                🏷️ Tags
                </SidebarLink>
            </li>
            <li>
                <SidebarLink href="/users">
                👥 Users
                </SidebarLink>
            </li>
            </ul>
        </nav>
        </aside>
    );
};

export default Sidebar;