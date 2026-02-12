import { useEffect, useState } from 'react';
import { api, type Blog } from '../api';
import { Link } from 'react-router-dom';

export function Admin() {
  const initialSecret = localStorage.getItem('admin_secret') || '';
  const [secret, setSecret] = useState(initialSecret);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [authorized, setAuthorized] = useState(!!initialSecret);

  useEffect(() => {
    if (secret) {
      api
        .getBlogs()
        .then(setBlogs)
        .catch(() => setAuthorized(false));
    }
  }, [secret]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('secret') as string;
    localStorage.setItem('admin_secret', input);
    setSecret(input);
    setAuthorized(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.deleteBlog(id, secret);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err);
    }
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto py-20">
        <form onSubmit={handleLogin} className="space-y-4 border p-6 rounded-lg bg-card">
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <input
            name="secret"
            type="password"
            placeholder="Enter Admin Secret"
            className="w-full p-2 border rounded bg-background"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 font-medium"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Link
          to="/admin/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 font-medium transition-colors"
        >
          Create New Post
        </Link>
      </div>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex justify-between items-center p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
          >
            <span className="font-medium truncate flex-1 pr-4">{blog.title}</span>
            <div className="space-x-4 shrink-0">
              <Link
                to={`/admin/edit/${blog.id}`}
                className="text-primary hover:underline font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(blog.id)}
                className="text-destructive hover:underline font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="text-center text-muted-foreground py-10">No posts. Create one!</div>
        )}
      </div>
    </div>
  );
}
