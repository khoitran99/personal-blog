import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-foreground selection:text-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between max-w-5xl mx-auto">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            BLOG.
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-foreground/60">
              Home
            </Link>
            <Link to="/admin" className="transition-colors hover:text-foreground/60">
              Write
            </Link>
          </nav>
        </div>
      </header>
      <main className="container max-w-5xl mx-auto py-12 px-4 min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
    </div>
  );
}
