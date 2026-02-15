import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api, type CreateBlogDto } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageTransition } from '@/components/PageTransition';
import { Save, X } from 'lucide-react';
// Wait, I haven't created Select component yet. I should stick to native select or create it.
// To save time and complexity for now, I will use native select styled with Tailwind or just create Select.
// Actually ShadCN Select is quite complex to copy-paste in one go without the registry.
// I'll stick to native select for now but styled better, or use a simple custom wrapper.

export function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateBlogDto>({
    title: '',
    content: '',
    tags: [],
    status: 'DRAFT',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBlog = async () => {
      if (id) {
        try {
          const blog = await api.getBlog(id);
          setFormData({
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            status: blog.status,
            coverImage: blog.coverImage,
          });
        } catch (error) {
          console.error('Failed to fetch blog', error);
          navigate('/admin');
        }
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImage = formData.coverImage;
      if (file) {
        coverImage = await api.uploadImage(file);
      }

      const dataToSubmit = { ...formData, coverImage };

      if (id) {
        await api.updateBlog(id, dataToSubmit);
      } else {
        await api.createBlog(dataToSubmit);
      }
      navigate('/admin');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, tags: e.target.value.split(',').map((t) => t.trim()) });
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{id ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-muted-foreground">
              {id ? 'Make changes to your blog post.' : 'Write something amazing.'}
            </p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <X className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
                required
                className="text-lg font-medium"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="relative">
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })
                    }
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 opacity-50"
                    >
                      <path
                        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags?.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="tech, life, nextjs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[400px] font-mono text-sm"
                placeholder="# Write something..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image</Label>
              <Input
                id="cover"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {(formData.coverImage || file) && (
                <div className="mt-2 aspect-video w-full max-w-sm rounded-md border overflow-hidden bg-muted">
                  <img
                    src={
                      JSON.stringify(file) !== 'null' && file
                        ? URL.createObjectURL(file)
                        : formData.coverImage
                    }
                    className="w-full h-full object-cover"
                    alt="Cover preview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
