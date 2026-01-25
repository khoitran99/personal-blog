import { useEffect, useState } from 'react';
import { api, type Blog } from '../api';
import { BlogCard } from '../components/BlogCard';

export function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getBlogs()
      .then((data) => {
        // Filter out drafts unless admin (logic can be improved)
        // Ideally backend handles filtering.
        setBlogs(data.filter((b) => b.status === 'PUBLISHED' || true)); // Showing all for now
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading posts...</div>;
  if (error) return <div className="text-center py-20 text-destructive">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Latest Posts</h1>
        <p className="text-muted-foreground">Thoughts, ideas, and randomness.</p>
      </div>
      {blogs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No posts found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
