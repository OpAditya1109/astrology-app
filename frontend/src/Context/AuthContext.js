import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    userId: null,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const login = (data) => {
    const newAuth = {
      token: data.token,
      role: data.role,
      userId: data.userId,
    };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth)); // persist
  };

  const logout = () => {
    setAuth({ token: null, role: null, userId: null });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
