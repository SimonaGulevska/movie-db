import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#121212] border-t border-zinc-800 pt-12 pb-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Branding & Copyright */}
        <div className="text-center">
          <div className="text-yellow-500 font-bold text-xl mb-2">IMDb</div>
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} by SimoNa.
          </p>
        </div>
      </div>
    </footer>
  );
}