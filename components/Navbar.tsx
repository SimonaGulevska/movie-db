'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clears the search bar after navigation
    }
  };

  return (
    <nav className="grid grid-cols-3 items-center px-4 md:px-8 py-4 bg-[#121212] border-b border-zinc-800 sticky top-0 z-50">
      
      {/* LEFT: Logo and Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-black bg-yellow-500 text-black px-2 py-0.5 rounded shrink-0">
          IMDb
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-semibold text-yellow-500">
          <Link href="/" className="hover:text-gray-300 transition">Movies</Link>
          <Link href="/watchlist" className="hover:text-gray-300 transition">Watchlist</Link>
        </div>
      </div>

      {/* MIDDLE: Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search IMDb..."
          className="w-full bg-white text-black py-1.5 px-4 pr-10 rounded-md outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
          🔍
        </button>
      </form>

      {/* RIGHT: User Section */}
      <div className="flex justify-end items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline text-xs text-zinc-400">
              Hi, {user.user_metadata?.username || 'User'}
            </span>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
                router.refresh();
              }} 
              className="text-sm font-bold text-yellow-500 hover:text-gray-300 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-sm font-bold text-yellow-500 hover:text-gray-300 border border-zinc-700 px-3 py-1.5 rounded hover:bg-zinc-800">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}