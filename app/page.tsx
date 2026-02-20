export const revalidate = 0; // This forces the page to fetch fresh data on every refresh
import { getTrendingMovies, getMoviesByGenre, getTopRated } from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';
import { supabase } from '@/lib/supabase';
import HeroSlider from '@/components/HeroSlider';

export default async function Home() {
  const trending = await getTrendingMovies();
  const topRated = await getTopRated();

  let recommendedMovies = null;
  let recentlyViewed = null;
  
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;
  
  if (user) {
    // Recommendation logic
    const { data: watchlist } = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', user.id);
      
    if (watchlist && watchlist.length > 0) {
      recommendedMovies = await getMoviesByGenre(878); 
    }

    // Recently Viewed logic
    const { data: views } = await supabase
      .from('recently_viewed')
      .select('*')
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false })
      .limit(12);

    if (views && views.length > 0) {
      recentlyViewed = views.map(v => ({
        id: v.movie_id,
        title: v.title,
        poster_path: v.poster_path,
        vote_average: v.rating
      }));
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
      
      {/* Conditionally render Recently Viewed instead of Action Packed */}
      {recentlyViewed && (
        <div className="mb-0">
          <MovieRow title="Recently Viewed" movies={recentlyViewed} userId={userId} />
        </div>
      )}
    </main>
  );
}