import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { api, type Blog } from '../api';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  if (error || !blog)
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-destructive">
        <p>Error: {error || 'Blog not found'}</p>
        <Button variant="outline" asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );

  return (
    <PageTransition>
      <article className="max-w-3xl mx-auto space-y-8 pb-20">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" asChild>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {blog.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2 text-sm text-muted-foreground uppercase tracking-wider">
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl leading-tight">
              {blog.title}
            </h1>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight">
          <Markdown>{blog.content}</Markdown>
        </div>
      </article>
    </PageTransition>
  );
}
