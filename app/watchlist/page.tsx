'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MovieCard from '@/components/MovieCard';
import { useRouter } from 'next/navigation';

export default function WatchlistPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getWatchlist() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);

      if (!error && data) {
        setMovies(data);
      }
      setLoading(false);
    }

    getWatchlist();
  }, [router]);

  const handleRemoveFromState = (id: number) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.movie_id !== id));
  };

  if (loading) {
    return <div className="p-20 text-center text-yellow-500">Loading Watchlist...</div>;
  }

  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8">Your Watchlist</h1>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.movie_id}
              id={movie.movie_id}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={movie.rating || 0} // Pass saved rating
              isWatchlistPage={true}
              onRemove={handleRemoveFromState}
              currentUserId={userId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-zinc-500">Your watchlist is empty.</p>
        </div>
      )}
    </main>
  );
}