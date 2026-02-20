import MovieCard from '@/components/MovieCard';
import { supabase } from '@/lib/supabase';

async function searchMovies(query: string) {
  const apiKey = process.env.TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }

  const data = await res.json();
  return data.results;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>; 
}) {
  const params = await searchParams;
  const query = params.q || '';
  
  if (!query) {
    return (
      <main className="p-8 bg-black min-h-screen text-white text-center">
        <h1 className="text-2xl">Please enter a search term.</h1>
      </main>
    );
  }

  const movies = await searchMovies(query);

  // Use getUser() for better reliability in Server Components
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">
        Results for: <span className="text-yellow-500 italic">"{query}"</span>
      </h1>

      {movies?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {movies.map((movie: any) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title || movie.name}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              currentUserId={userId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-xl">No movies found matching your search.</p>
        </div>
      )}
    </main>
  );
}