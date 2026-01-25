import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { api, type Blog } from '../api';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .getBlog(id)
      .then(setBlog)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading post...</div>;
  if (error || !blog)
    return (
      <div className="text-center py-20 text-destructive">Error: {error || 'Blog not found'}</div>
    );

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <Link to="/" className="text-muted-foreground hover:text-foreground mb-8 inline-block">
        ← Back to Home
      </Link>

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full aspect-video object-cover rounded-lg border border-border"
        />
      )}

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{blog.title}</h1>
        <div className="flex gap-4 text-muted-foreground">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          {blog.tags && blog.tags.length > 0 && (
            <>
              <span>•</span>
              <span>{blog.tags.join(', ')}</span>
            </>
          )}
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <Markdown>{blog.content}</Markdown>
      </div>
    </article>
  );
}
