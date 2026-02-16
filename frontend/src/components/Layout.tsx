import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ModeToggle } from './mode-toggle';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-foreground selection:text-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between max-w-5xl mx-auto">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            Khoi Tran's Blog
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-foreground/60">
              Home
            </Link>
            <Link to="/admin" className="transition-colors hover:text-foreground/60">
              Write
            </Link>
            {/* Simple check for token presence. For better reactivity, use context/state in future. */}
            {localStorage.getItem('access_token') && (
              <button
                onClick={() => {
                  // Import api here or use direct localStorage removal to avoid circular deps if any
                  // But layout uses components, api is fine.
                  // We need to import api.
                  // And standard router navigation.
                  // Since this is a small app, force reload or just navigate to login?
                  // api.logout() clears token.
                  localStorage.removeItem('access_token');
                  window.location.href = '/login';
                }}
                className="transition-colors hover:text-foreground/60"
              >
                Logout
              </button>
            )}
            <ModeToggle />
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
