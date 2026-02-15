import { useEffect, useState } from 'react';
import { api, type Blog } from '../api';
import { BlogCard } from '../components/BlogCard';
import { PageTransition } from '@/components/PageTransition';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getBlogs()
      .then((data) => {
        setBlogs(data.filter((b) => b.status === 'PUBLISHED' || true));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        Error: {error}
      </div>
    );

  return (
    <PageTransition>
      <div className="space-y-12">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
            Thoughts & Ideas
          </h1>
          <p className="text-xl text-muted-foreground">
            A minimalist collection of writings on technology, design, and life.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No posts found.</div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={item}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
