import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import { getAllBlogs } from "../services/blog.service";

const MyBlogs = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const data = await getAllBlogs();
        const blogs = data.content || data;

        const myBlogs = blogs.filter(
          (blog) => blog.user?.idUser === user.idUser
        );

        setPosts(
          myBlogs.map(blog => ({
            id: blog.idBlog,
            title: blog.title,
            description: blog.content,
            imageUrl:
                  blog.imageUrl ||
                  "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1679&q=80",
            author: {
              idUser: blog.user.idUser,
              name: blog.user.name
            }
          }))
        );
      } catch (error) {
        console.error("Error loading my blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [user]);

  if (loading) return <p className="text-center py-10">Cargando...</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Mis blogs</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">Aún no has creado blogs.</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
