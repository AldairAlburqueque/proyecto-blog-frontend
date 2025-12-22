import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllBlogs } from "../services/blog.service";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";

const UserBlogs = () => {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== "Admin")) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        const blogs = data.content || data;

        const filtered = blogs.filter(
          (blog) => blog.user?.idUser === Number(idUser)
        );

        if (filtered.length > 0) {
          setUserName(filtered[0].user.name);
        }

        setPosts(
          filtered.map((blog) => ({
            id: blog.idBlog,
            title: blog.title,
            description: blog.content,
            imageUrl:
              blog.imageUrl ||
              "https://images.unsplash.com/photo-1496128858413-b36217c2ce36",
            author: {
              idUser: blog.user.idUser,
              name: blog.user.name,
            },
          }))
        );
      } catch (err) {
        console.error("Error loading blogs", err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, [idUser, currentUser]);

  if (loading || loadingBlogs) {
    return <p className="text-center py-10">Cargando blogs…</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">
        Blogs de {userName || "este usuario"}
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          Este usuario no tiene blogs creados.
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs;
