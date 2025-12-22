import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllCategories } from "../services/category.service";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories", error);
      }
    };
    fetchCategories();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            BlogApp
          </Link>

          {/* DESKTOP */}
          <div className="hidden sm:flex items-center space-x-6">

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`
              }
            >
              Home
            </NavLink>

            {/* SOLO LOGUEADO */}
            {user && (
              <>
                {categories.map((category) => (
                  <NavLink
                    key={category.idCategory}
                    to={`/category/${category.idCategory}`}
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-600 hover:text-indigo-600"
                      }`
                    }
                  >
                    {category.categoria}
                  </NavLink>
                ))}

                {/* SEARCH */}
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search blogs..."
                    className="border rounded-l-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-3 py-1 rounded-r-full hover:bg-indigo-700"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                <Link
                  to="/create-blog"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Write Blog
                </Link>

                {/* USER INFO */}
               <Link
  to="/profile"
  className="flex items-center space-x-2 hover:opacity-80"
>
  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
    {user.name.charAt(0).toUpperCase()}
  </div>
  <span className="text-sm font-medium">{user.name}</span>
</Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            )}

            {/* NO LOGUEADO */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="sm:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t px-4 py-4 space-y-2">

          {/* USER INFO */}
          {user && (
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
          )}

          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2">
            Home
          </Link>

          {user && (
            <>
              {/* SEARCH */}
              <form onSubmit={handleSearch} className="flex my-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blogs..."
                  className="flex-1 border rounded-l-md px-3 py-2 text-sm"
                />
                <button className="bg-indigo-600 text-white px-3 rounded-r-md">
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {categories.map((category) => (
                <Link
                  key={category.idCategory}
                  to={`/category/${category.idCategory}`}
                  onClick={() => setIsOpen(false)}
                  className="block py-2"
                >
                  {category.categoria}
                </Link>
              ))}

              <Link
                to="/create-blog"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-indigo-600"
              >
                Write Blog
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-red-600"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2 text-indigo-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
