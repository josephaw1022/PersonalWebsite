export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-20 py-8 z-10 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm text-zinc-600 dark:text-white">
          {year} © Joseph Whiteaker
        </p>
        <div className="flex gap-6 font-mono text-sm text-zinc-600 dark:text-white">
          <a
            href="https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/josephaw1022"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://medium.com/@josephsims1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Medium
          </a>
        </div>
      </div>
    </footer>
  );
}
