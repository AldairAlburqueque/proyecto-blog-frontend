import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { getBlogsByCategory } from '../services/blog.service';

const CategoryPage = () => {
  const { idCategory } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setCategoryName('');
        const data = await getBlogsByCategory(idCategory);

        const blogs = data.content || data;

        if (blogs.length > 0) {
          setCategoryName(blogs[0].category?.categoria || '');
        }

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
          author: {
            idUser: blog.user?.idUser,
            name: blog.user?.name || 'Unknown',
            imageUrl:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          },
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error loading category blogs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [idCategory]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-extrabold mb-4">
          Blogs de la categoría {categoryName}
        </h2>

        {posts.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay blogs en esta categoría.
          </p>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
