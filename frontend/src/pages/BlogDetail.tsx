import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { api, type Blog } from '../api';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { SEO } from '@/components/SEO';

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
      {blog && (
        <SEO
          title={blog.title}
          description={blog.content.slice(0, 150).replace(/<[^>]*>?/gm, '')}
        />
      )}
      <article className="max-w-3xl mx-auto space-y-8 pb-20">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" asChild>
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {blog.coverImage && (
          <div className="w-full overflow-hidden rounded-lg border bg-muted flex justify-center bg-black/5">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-auto h-auto max-h-[300px] object-contain"
            />
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
                  hour: '2-digit',
                  minute: '2-digit',
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

        <div
          className="prose prose-zinc dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight [&_img]:rounded-md [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />
      </article>
    </PageTransition>
  );
}
