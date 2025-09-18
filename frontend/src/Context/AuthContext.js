import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    const newAuth = {
      token: data.token,
      user: {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        mobile: data.user.mobile,
        role: data.user.role,
        birthTime: data.user.birthTime,
        birthPlace: data.user.birthPlace,
        dob: data.user.dob,
        kundaliUrl: data.user.kundaliUrl,
      },
    };

    setAuth(newAuth);

    // Save to storage
    localStorage.setItem("auth", JSON.stringify(newAuth));
    sessionStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    sessionStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
