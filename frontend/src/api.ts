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

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    api.logout();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return res;
};

export const api = {
  login: async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    const { access_token } = await res.json();
    localStorage.setItem('access_token', access_token);
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getToken: () => localStorage.getItem('access_token'),

  getBlogs: async (): Promise<Blog[]> => {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  getBlog: async (id: string): Promise<Blog> => {
    const res = await fetch(`${API_URL}/blogs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  },

  createBlog: async (data: CreateBlogDto): Promise<Blog> => {
    const res = await fetchWithAuth(`${API_URL}/blogs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return res.json();
  },

  updateBlog: async (id: string, data: Partial<CreateBlogDto>): Promise<Blog> => {
    const res = await fetchWithAuth(`${API_URL}/blogs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return res.json();
  },

  deleteBlog: async (id: string): Promise<void> => {
    const res = await fetchWithAuth(`${API_URL}/blogs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete blog');
  },

  uploadImage: async (file: File): Promise<string> => {
    // 1. Get presigned URL
    const contentType = file.type || 'application/octet-stream';
    const presignRes = await fetchWithAuth(`${API_URL}/upload/presigned-url`, {
      method: 'POST',
      body: JSON.stringify({ contentType }),
    });

    if (!presignRes.ok) throw new Error('Failed to get upload URL');
    const { url, publicUrl } = await presignRes.json();

    // 2. Upload to S3 (Direct upload, no auth header needed for S3 presigned URL itself usually, but check requirements. usually standard fetch is fine)
    // The previous implementation used standard fetch for S3 upload, preserving that.
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file,
    });
    if (!uploadRes.ok) throw new Error('Failed to upload image to S3');

    return publicUrl;
  },
};
