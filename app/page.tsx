export const revalidate = 0; 
import { getTrendingMovies, getMoviesByGenre, getTopRated, getUpcomingMovies } from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';
import { supabase } from '@/lib/supabase';
import HeroSlider from '@/components/HeroSlider';

export default async function Home() {
  // Fetching upcoming alongside trending and top rated
  const [trending, topRated, upcoming] = await Promise.all([
    getTrendingMovies(),
    getTopRated(),
    getUpcomingMovies()
  ]);

  let recommendedMovies = null;
  
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;
  
  if (userId) {
    const { data: watchlist } = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', userId);
      
    if (watchlist && watchlist.length > 0) {
      recommendedMovies = await getMoviesByGenre(878); 
    }
  }

  return (
    <main className="bg-black min-h-screen text-white pb-4">
      <HeroSlider movies={recommendedMovies || trending} />

      {recommendedMovies && (
        <MovieRow title="Recommended For You" movies={recommendedMovies} userId={userId} />
      )}
      
      <MovieRow title="Trending Now" movies={trending} userId={userId} />
      <MovieRow title="Top Rated Classics" movies={topRated} userId={userId} />
      
      {/* Added Upcoming Releases Row */}
      <MovieRow title="Upcoming Releases" movies={upcoming} userId={userId} />
    </main>
  );
}