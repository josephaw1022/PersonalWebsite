export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 mt-20 py-8 z-10 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm text-zinc-600">
          {year} © Joseph Whiteaker
        </p>
        <div className="flex gap-6 font-mono text-sm text-zinc-600">
          <a href="https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
          <a href="https://github.com/josephaw1022" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">GitHub</a>
          <a href="https://medium.com/@josephsims1" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Medium</a>
        </div>
      </div>
    </footer>
  );
}
