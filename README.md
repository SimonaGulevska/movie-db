# 🎬 IMDb

A modern, high-performance IMDb clone built with **Next.js 15**, **TMDB API**, and **Supabase**. IMDb offers a seamless movie discovery experience with personalized features and a cinematic UI.

![App Preview](/public/image1.png)

## ✨ Features

- **Cinematic Hero Slider:** Dynamic homepage featuring trending titles and personalized recommendations.
- **Real-time Discovery:** Browse Trending, Top Rated, and Genre-specific rows powered by the TMDB API.
- **Upcoming Releases:** Stay ahead of the curve with a dedicated section for highly anticipated future titles.
- **User Reviews:** Share your thoughts! Integrated review system allowing logged-in users to post and read community feedback stored directly in Supabase.
- **Detailed Movie Insights:** Comprehensive details including overview, budget, revenue, and production status.
- **Smart Watchlist:** Add or remove films from your personal collection with real-time UI updates (Persistent after refresh).
- **Interactive Cast Gallery:** Visual actor profiles with a fallback system that generates initials for missing photos.
- **Optimized Navigation:** Direct "Details" access from any card and smooth horizontal scrolling for movie rows.

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), Tailwind CSS, TypeScript
* **Backend/Auth:** Supabase (PostgreSQL) with **@supabase/ssr** for robust session handling.
* **Data Source:** The Movie Database (TMDB) API
* **State Management:** React Hooks & Supabase Auth Sessions

## 🚀 Getting Started

1.  **Environment Setup:** Create a `.env.local` file with your keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    TMDB_API_KEY=your_tmdb_api_key
    ```
2.  **Install & Run:**
    ```bash
    npm install
    npm run dev
    ```

## 📸 Adding Screenshots
`![Main Page Sections](/public/image2.png)`
`![Registration Form](/public/image3.png)`
`![Log in Form](/public/image4.png)`
`![Results UI](/public/image5.png)`
`![User's Watchlist](/public/image6.png)`
`![User's Reviews](/public/image7.png)`
`![User's Reviews (not logged in)](/public/image8.png)`