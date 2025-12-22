import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    const decoded = jwtDecode(storedToken);

    setUser({
      idUser: decoded.idUser,
      name: decoded.name,
      email: decoded.sub,
      role: decoded.role,
    });
    setToken(storedToken);
  }
  setLoading(false);
}, []);

  const login = (userData, authToken) => {
  const decoded = jwtDecode(authToken);

  const userFromToken = {
    idUser: decoded.idUser,
    name: decoded.name,
    email: decoded.sub,
    role: decoded.role,
  };

  setUser(userFromToken);
  setToken(authToken);

  localStorage.setItem('token', authToken);
  localStorage.setItem('user', JSON.stringify(userFromToken));
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
