import { Link } from 'react-router-dom';
import type { Blog } from '../api';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="group relative flex flex-col space-y-2 border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      {blog.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{blog.title}</h2>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          {blog.tags && blog.tags.length > 0 && (
            <>
              <span>•</span>
              <span>{blog.tags.join(', ')}</span>
            </>
          )}
        </div>
      </div>
      <p className="text-muted-foreground line-clamp-3">{blog.content}</p>
      <Link to={`/blog/${blog.id}`} className="absolute inset-0">
        <span className="sr-only">Read more</span>
      </Link>
    </article>
  );
}
