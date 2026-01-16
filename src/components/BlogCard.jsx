import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteBlogButton from "./DeleteBlogButton";
import { deleteBlog } from "../services/blog.service";

const BlogCard = ({ post, onDeleted }) => {
  const { user, loading } = useAuth();
  if (loading) return null;

  const isAdmin = user?.role === "Admin";
  const isOwner = user?.idUser === post.user?.idUser;

  const canDelete = isAdmin || isOwner;

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este blog?")) return;

    try {
      await deleteBlog(post.id);
      onDeleted(post.id);
    } catch (error) {
      console.error(error);
      alert("No tienes permisos para eliminar este blog");
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg shadow-lg bg-white">
      <Link to={`/blog/${post.id}`}>
        <img
          className="h-48 w-full object-cover"
          src={post.imageUrl}
          alt={post.title}
        />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">{post.user?.name}</span>

          {canDelete && <DeleteBlogButton onDelete={handleDelete} />}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
