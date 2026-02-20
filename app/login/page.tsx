'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Clean data to prevent "Invalid Credentials" due to accidental spaces
    const cleanEmail = email.trim();

    if (isRegistering) {
      // 1. REGISTRATION LOGIC
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
            phone: phone,
          }
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
        router.refresh(); 
      }
    } else {
      // 2. LOGIN LOGIC
      // Ensure any previous session is cleared before a new login attempt
      await supabase.auth.signOut();

      const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });
      
      if (loginError) {
        console.error("Login attempt failed:", loginError.message);
        setError(loginError.message);
      } else {
        router.push('/');
        router.refresh();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10 px-4">
      <form onSubmit={handleAuth} className="bg-[#1a1a1a] p-8 rounded-lg border border-zinc-800 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-500">
          {isRegistering ? 'Create IMDb Account' : 'Sign In'}
        </h2>
        
        {error && <p className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/20 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isRegistering && (
            <>
              <div>
                <label className="text-xs text-zinc-400 uppercase font-bold">First Name</label>
                <input type="text" className="input-style" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase font-bold">Last Name</label>
                <input type="text" className="input-style" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase font-bold">Username</label>
                <input type="text" className="input-style" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase font-bold">Phone</label>
                <input type="tel" className="input-style" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-400 uppercase font-bold">Email</label>
            <input type="email" className="input-style" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-zinc-400 uppercase font-bold">Password</label>
            <input type="password" className="input-style" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        <button className="w-full bg-yellow-500 text-black font-bold py-3 rounded mt-6 hover:bg-yellow-600 transition-colors shadow-lg active:scale-95">
          {isRegistering ? 'Create your IMDb account' : 'Sign In'}
        </button>

        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full text-center text-sm text-zinc-400 mt-6 hover:text-white underline">
          {isRegistering ? 'Already have an account? Sign In' : "New to IMDb? Create an account"}
        </button>
      </form>

      <style jsx>{`
        .input-style {
          width: 100%;
          background: #000;
          border: 1px solid #3f3f46;
          padding: 10px;
          border-radius: 4px;
          margin-top: 4px;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-style:focus {
          border-color: #eab308;
        }
      `}</style>
    </div>
  );
}