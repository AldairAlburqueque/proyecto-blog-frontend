import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import BlogCard from '../components/BlogCard';
import { getAllBlogs } from '../services/blog.service';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('createdAt,desc');

const { user, loading: authLoading } = useAuth();

  const handlePostDeleted = (deletedId) => {
  setPosts(prevPosts =>
    prevPosts.filter(post => post.id !== deletedId)
  );
};

  useEffect(() => {
  if (authLoading) return;

  // SI NO HAY USUARIO → NO HAY BLOGS
  if (!user) {
    setPosts([]);
    setLoading(false);
    return;
  }

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs(0, 10, sort);
      const blogs = data.content || data;

      const formattedPosts = blogs.map(blog => ({
        id: blog.idBlog,
        title: blog.title,
        href: `/blog/${blog.idBlog}`,
        category: blog.category?.categoria || 'General',
        description: blog.content,
        date: blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
        imageUrl:
          blog.imageUrl ||
          'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1679&q=80',
        readTime: '5 min',
        user: blog.user,
        author: {
          idUser: blog.user?.idUser,
          name: blog.user?.name || 'Unknown',
          imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
    }
  };

  fetchBlogs();
}, [user, authLoading, sort]);


  return (
    <>
      <Hero />
      <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              From the blog
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Expert insights and industry trends.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setSort('createdAt,desc')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  sort === 'createdAt,desc'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSort('createdAt,asc')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  sort === 'createdAt,asc'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Oldest
              </button>
            </div>
          </div>
          {!user ? (
  <div className="mt-12 text-center text-gray-500">
    Please log in to see blog posts.
  </div>
) : loading ? (
  <div className="mt-12 text-center">Loading...</div>
) : (
  <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
    {posts.map((post) => (
      <BlogCard
        key={post.id}
        post={post}
        onDeleted={handlePostDeleted}
      />
    ))}
  </div>
)}
        </div>
      </div>
    </>
  );
};

export default Home;
