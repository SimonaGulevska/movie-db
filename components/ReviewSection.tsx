'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ReviewSection({ movieId }: { movieId: number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      // Fetches user session directly in the browser
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      fetchReviews();
    };
    init();
  }, [movieId]);

  async function fetchReviews() {
    const { data } = await supabase
      .from('movie_reviews')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return alert("Please log in to review!");
    if (!content.trim()) return;

    setLoading(true);
    // Saves directly to your Supabase table
    const { error } = await supabase.from('movie_reviews').insert({
      user_id: user.id,
      movie_id: movieId,
      user_email: user.email,
      content: content
    });

    if (!error) {
      setContent('');
      fetchReviews();
    }
    setLoading(false);
  }

  return (
    <div className="mt-12 border-t border-zinc-800 pt-8">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500">User Reviews</h2>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea 
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-500"
            placeholder="Write your thoughts on this movie..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition"
          >
            {loading ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      ) : (
        <p className="text-zinc-500 mb-8 italic">Please log in to leave a review.</p>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review.id} className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-yellow-500 font-medium text-sm">{review.user_email || 'Anonymous'}</span>
              <span className="text-zinc-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">{review.content}</p>
          </div>
        )) : (
          <p className="text-zinc-600">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}