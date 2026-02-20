import Image from 'next/image';
import { getMovieDetails, getSimilarMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { supabase } from '@/lib/supabase';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [movie, similarMovies, { data: { user } }] = await Promise.all([
    getMovieDetails(id),
    getSimilarMovies(id),
    supabase.auth.getUser()
  ]);

  if (!movie) return <div className="p-20 text-center text-white">Movie not found.</div>;

  const userId = user?.id || null;

  // Record Recently Viewed if user is logged in
  if (userId) {
    await supabase.from('recently_viewed').upsert({
      user_id: userId,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      rating: movie.vote_average,
      viewed_at: new Date().toISOString()
    }, { onConflict: 'user_id, movie_id' });
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Banner Area */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="absolute bottom-10 left-10 flex gap-8 items-end w-full pr-10">
          <div className="relative w-48 h-72 hidden md:block border-2 border-zinc-800 rounded-lg overflow-hidden shadow-2xl shrink-0">
            <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} fill className="object-cover" />
          </div>
          <div className="flex-grow">
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 text-zinc-300 text-sm md:text-base items-center">
              <span className="bg-zinc-800 px-2 py-1 rounded text-white font-bold">{movie.release_date.split('-')[0]}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span className="text-yellow-500 font-bold flex items-center gap-1">
                <span className="text-lg">★</span> {movie.vote_average.toFixed(1)}
              </span>
              <span>•</span>
              <span className="italic text-zinc-400">{movie.genres.map((g: any) => g.name).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">Overview</h2>
              <p className="text-zinc-300 leading-relaxed text-lg">{movie.overview}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-yellow-500">Top Cast</h2>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
              {movie.credits?.cast.slice(0, 8).map((actor: any) => (
                <div key={actor.id} className="min-w-[120px] text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-yellow-500 transition-colors bg-zinc-900 flex items-center justify-center">
                    {actor.profile_path ? (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                        alt={actor.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <span className="text-zinc-500 font-bold text-xl uppercase">
                        {actor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white line-clamp-1">{actor.name}</p>
                  <p className="text-xs text-zinc-500 line-clamp-1">{actor.character}</p>
                </div>
              ))}
              </div>
            </section>
          </div>

          <div className="space-y-8 bg-zinc-900/30 p-8 rounded-xl border border-zinc-800 h-fit">
            <div>
              <h3 className="text-zinc-500 uppercase text-xs font-black tracking-widest mb-2">Status</h3>
              <p className="text-lg font-medium">{movie.status}</p>
            </div>
            <div>
              <h3 className="text-zinc-500 uppercase text-xs font-black tracking-widest mb-2">Budget</h3>
              <p className="text-lg font-medium text-green-500">${movie.budget.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-zinc-500 uppercase text-xs font-black tracking-widest mb-2">Revenue</h3>
              <p className="text-lg font-medium text-green-500">${movie.revenue.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-zinc-500 uppercase text-xs font-black tracking-widest mb-2">Production</h3>
              <div className="space-y-1">
                {movie.production_companies?.slice(0, 2).map((comp: any) => (
                  <p key={comp.id} className="text-sm text-zinc-300">{comp.name}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <section className="border-t border-zinc-800 pt-12">
            <h2 className="text-3xl font-black mb-8 text-white border-l-4 border-yellow-500 pl-4">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {similarMovies.slice(0, 6).map((sim: any) => (
                <MovieCard 
                  key={sim.id}
                  id={sim.id}
                  title={sim.title}
                  posterPath={sim.poster_path}
                  rating={sim.vote_average}
                  currentUserId={userId}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}