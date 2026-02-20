import { Link } from 'react-router-dom';
import type { Blog } from '../api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

// Let's stick to standard HTML/Tailwind for tags for now if Badge isn't created.
// Actually, I should probably create a Badge component as per ShadCN.

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link to={`/blog/${blog.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:bg-muted/50 hover:shadow-md border-border/40 group">
        {blog.coverImage && (
          <div className="aspect-video w-full overflow-hidden border-b border-border/40">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="space-y-2 p-6">
          <div className="flex gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{blog.views || 0}</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-xl font-bold leading-tight group-hover:underline decoration-2 underline-offset-4">
            {blog.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="line-clamp-3 text-muted-foreground leading-relaxed">
            {blog.content.replace(/<[^>]*>?/gm, '').slice(0, 150)}...
          </p>
        </CardContent>
        {blog.tags && blog.tags.length > 0 && (
          <CardFooter className="p-6 pt-0 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                {tag}
              </span>
            ))}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
