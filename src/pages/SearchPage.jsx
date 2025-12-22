import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { searchBlogs } from "../services/blog.service";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const blogs = await searchBlogs(query);

        const formatted = blogs.map(blog => ({
          id: blog.idBlog,
          title: blog.title,
          description: blog.content,
          imageUrl:
            blog.imageUrl ||
            "https://images.unsplash.com/photo-1496128858413-b36217c2ce36",
          author: {
            idUser: blog.user?.idUser,
            name: blog.user?.name || "Unknown",
          },
        }));

        setPosts(formatted);
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">
          Resultados para: <span className="text-indigo-600">{query}</span>
        </h2>

        {loading ? (
          <p>Buscando...</p>
        ) : posts.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No se encontraron blogs.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
