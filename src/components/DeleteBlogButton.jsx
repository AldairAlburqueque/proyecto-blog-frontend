import { Trash2 } from "lucide-react";

const DeleteBlogButton = ({ onDelete }) => {
  return (
    <button
      onClick={onDelete}
      className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
      title="Eliminar blog"
    >
      <Trash2 size={18} />
    </button>
  );
};

export default DeleteBlogButton;
