'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-display gradient-text">
          PDF-GPT
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-dark-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-dark-300 hover:text-white transition-colors">
            Blog
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-dark-700 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
                <span className="hidden md:block text-sm text-dark-200">
                  {session.user.name || session.user.email}
                </span>
                <Badge role={session.user.role} className="hidden md:inline-flex">
                  {session.user.role.replace('_', ' ')}
                </Badge>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl py-2 shadow-xl">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 text-dark-200 hover:bg-white/5 hover:text-white"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-dark-200 hover:bg-white/5 hover:text-white"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  {session.user.role === 'free_user' && (
                    <Link
                      href="/pricing"
                      className="flex items-center gap-3 px-4 py-2 text-primary-400 hover:bg-white/5"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Crown size={16} />
                      Upgrade to Pro
                    </Link>
                  )}
                  <div className="divider my-2" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-white/5 w-full text-left"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
