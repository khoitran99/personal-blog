import { useEffect, useState } from 'react';
import { api, type Blog } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/PageTransition';
import { PlusCircle, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';

export function Admin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    api
      .getBlogs()
      .then(setBlogs)
      .catch((err) => {
        console.error(err);
        // If fetch fails (e.g. 401), maybe token expired
        navigate('/login');
      });
  }, [navigate]);

  const handleDelete = async (id: string) => {
    // Custom confirm dialog or just browser confirm for now
    // Toast promise is good too
    toast.promise(api.deleteBlog(id), {
      loading: 'Deleting...',
      success: () => {
        setBlogs(blogs.filter((b) => b.id !== id));
        return 'Post deleted';
      },
      error: 'Failed to delete post',
    });
  };

  // Logout moved to Layout

  return (
    <PageTransition>
      <SEO title="Dashboard" />
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog posts.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/admin/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="hover:underline flex items-center gap-2"
                      >
                        {blog.title}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          blog.status === 'PUBLISHED'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/edit/${blog.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(blog.id)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageTransition>
  );
}
