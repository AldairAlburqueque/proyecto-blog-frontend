import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import AdminUsers from './pages/AdminUsers';
import CategoryPage from './pages/CategoryPage';
import { AuthProvider } from './context/AuthContext';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import MyBlogs from './pages/MyBlogs';
import UserBlogs from './pages/UserBlogs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/category/:idCategory" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/edit-blog/:id" element={<CreateBlog />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/blogs" element={<MyBlogs />} />
              <Route path="/admin/users" element={<AdminUsers />} />

              <Route path="/admin/users/:idUser/blogs" element={<UserBlogs />} />

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
