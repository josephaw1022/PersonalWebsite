export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/50 mt-20 py-10 z-10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {year} Joseph Whiteaker • Cloud-Native Engineer
        </p>
        <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
          <a href="https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">LinkedIn</a>
          <a href="https://github.com/josephaw1022" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">GitHub</a>
          <a href="https://medium.com/@josephsims1" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Medium</a>
        </div>
      </div>
    </footer>
  );
}
