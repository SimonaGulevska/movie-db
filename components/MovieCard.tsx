'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface MovieProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  isWatchlistPage?: boolean;
  onRemove?: (id: number) => void; 
  currentUserId?: string | null;
}

export default function MovieCard({ id, title, posterPath, rating, isWatchlistPage, onRemove, currentUserId }: MovieProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      // If no ID is passed yet, don't run the query.
      if (!currentUserId) return;

      const { data } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('movie_id', id)
        .maybeSingle();

      if (data) setIsInWatchlist(true);
    };

    if (!isWatchlistPage) checkWatchlist();
    // CRITICAL: currentUserId must be in the dependency array
  }, [id, isWatchlistPage, currentUserId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleWatchlistAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    let activeUserId = currentUserId;

    if (!activeUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      activeUserId = session?.user?.id || null;
    }

    if (!activeUserId) {
      router.push('/login');
      return;
    }

    if (isWatchlistPage) {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', activeUserId)
        .eq('movie_id', id);

      if (error) {
        setToast({ message: 'Error removing movie', type: 'error' });
      } else if (onRemove) {
        onRemove(id);
      }
    } else {
      if (isInWatchlist) return;

      const { error } = await supabase
        .from('watchlist')
        .insert([{ 
          user_id: activeUserId, 
          movie_id: id, 
          title, 
          poster_path: posterPath,
          rating: rating 
        }]);

      if (error) {
        setToast({ message: 'Error. You already added to watchlist!', type: 'error' });
      } else {
        setIsInWatchlist(true);
        setToast({ message: `"${title}" added to watchlist!`, type: 'success' });
      }
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
          <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            toast.type === 'success' 
            ? 'bg-yellow-500 text-black border-yellow-400' 
            : 'bg-red-600 text-white border-red-500'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      <div 
        onClick={() => router.push(`/movie/${id}`)}
        className="bg-[#1a1a1a] rounded-md overflow-hidden hover:scale-105 transition-transform duration-200 border border-zinc-800 flex flex-col h-full group cursor-pointer"
      >
        <div className="relative aspect-[2/3] w-full">
          {posterPath ? (
            <Image src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-xs">No Image</div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <div className="flex items-center gap-1 text-yellow-500 mb-1 text-sm">
            <span>★</span>
            <span className="text-white">{rating?.toFixed(1)}</span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 mb-3 flex-grow">{title}</h3>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/movie/${id}`);
              }}
              className="w-full py-1.5 rounded text-sm font-bold bg-zinc-700 text-white hover:bg-zinc-600 transition"
            >
              Details
            </button>

            <button 
              onClick={handleWatchlistAction}
              disabled={!isWatchlistPage && isInWatchlist}
              className={`w-full py-1.5 rounded text-sm font-bold transition ${
                isWatchlistPage 
                ? 'bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white' 
                : isInWatchlist 
                  ? 'bg-zinc-700 text-zinc-400 cursor-default' 
                  : 'bg-zinc-800 text-blue-400 hover:bg-zinc-700'
              }`}
            >
              {isWatchlistPage ? '− Remove' : isInWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}