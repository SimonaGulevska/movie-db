'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface HeroSliderProps {
  movies: any[];
}

export default function HeroSlider({ movies }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from('watchlist')
      .insert([{ 
        user_id: session.user.id, 
        movie_id: currentMovie.id, 
        title: currentMovie.title, 
        poster_path: currentMovie.poster_path,
        rating: currentMovie.vote_average // Added rating
      }]);

    if (error) {
      setToast('Already in watchlist or error occurred');
    } else {
      setToast(`"${currentMovie.title}" added to watchlist!`);
    }
  };

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-xl animate-bounce">
          {toast}
        </div>
      )}

      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={() => router.push(`/movie/${currentMovie.id}`)}
      >
        <Image 
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-12 left-8 md:left-16 max-w-2xl z-10">
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{currentMovie.title}</h1>
        <p className="text-sm md:text-lg text-zinc-200 line-clamp-3 mb-6 drop-shadow-md">
          {currentMovie.overview}
        </p>
        
        <button 
          onClick={handleWatchlist}
          className="bg-yellow-500 text-black px-8 py-3 rounded font-bold hover:bg-yellow-400 transition-all active:scale-95 shadow-lg"
        >
          + Add to Watchlist
        </button>
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-6xl text-white/30 hover:text-yellow-500 transition-all opacity-0 group-hover:opacity-100 select-none"
      >
        ‹
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-6xl text-white/30 hover:text-yellow-500 transition-all opacity-0 group-hover:opacity-100 select-none"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-yellow-500 w-8' : 'bg-white/30 w-4'}`}
          />
        ))}
      </div>
    </div>
  );
}