import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "Admin";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mi perfil</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Nombre</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Rol</p>
          <p className="font-medium">{user.role}</p>
        </div>

        <Link
          to="/profile/blogs"
          className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ver mis blogs
        </Link>

        {/* SOLO PARA ADMIN */}
        {isAdmin && (
          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">
              Hola {user.name}, tu rol es <b>Admin</b>
            </p>

            <Link
              to="/admin/users"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Gestionar usuarios
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
