import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center max-w-screen-xl mx-auto px-4">
          <div className="mr-4 hidden md:flex w-full justify-between">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-lg">Modern Blog</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Home
              </Link>
              <Link
                to="/admin"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-8 max-w-screen-xl mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
}
