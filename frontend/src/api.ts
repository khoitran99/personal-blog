const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Blog {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  status?: 'DRAFT' | 'PUBLISHED';
}

export const api = {
  getBlogs: async (): Promise<Blog[]> => {
    const res = await fetch(`${API_URL}/blog`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  getBlog: async (id: string): Promise<Blog> => {
    const res = await fetch(`${API_URL}/blog/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  },

  createBlog: async (data: CreateBlogDto, secret: string): Promise<Blog> => {
    const res = await fetch(`${API_URL}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return res.json();
  },

  updateBlog: async (id: string, data: Partial<CreateBlogDto>, secret: string): Promise<Blog> => {
    const res = await fetch(`${API_URL}/blog/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return res.json();
  },

  deleteBlog: async (id: string, secret: string): Promise<void> => {
    const res = await fetch(`${API_URL}/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-secret': secret,
      },
    });
    if (!res.ok) throw new Error('Failed to delete blog');
  },

  uploadImage: async (file: File, secret: string): Promise<string> => {
    // 1. Get presigned URL
    const presignRes = await fetch(`${API_URL}/upload/presigned-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify({ contentType: file.type }),
    });
    if (!presignRes.ok) throw new Error('Failed to get upload URL');
    const { url, publicUrl } = await presignRes.json();

    // 2. Upload to S3
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    if (!uploadRes.ok) throw new Error('Failed to upload image to S3');

    return publicUrl;
  },
};
