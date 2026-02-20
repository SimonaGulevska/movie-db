'use client';

import { useRef } from 'react';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: any[];
  userId: string | null;
}

export default function MovieRow({ title, movies, userId }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-6 px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-yellow-500">{title}</h2>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => scroll('left')}
            className="text-5xl text-yellow-500 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer select-none leading-none pb-2"
            aria-label="Scroll Left"
          >
            ‹
          </button>
          <button
            onClick={() => scroll('right')}
            className="text-5xl text-yellow-500 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer select-none leading-none pb-2"
            aria-label="Scroll Right"
          >
            ›
          </button>
        </div>
      </div>

      <div 
        ref={rowRef}
        className="flex overflow-x-auto gap-6 pb-4 no-scrollbar scroll-smooth"
      >
        {movies?.map((movie) => (
          <div key={movie.id} className="min-w-[200px] md:min-w-[240px]">
            <MovieCard 
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              currentUserId={userId} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}