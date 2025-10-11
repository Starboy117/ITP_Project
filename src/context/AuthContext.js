import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Register
  const register = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", data);
      return response.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  // Combined login: first try staff/admin, then user
  const loginCombined = async (email, password) => {
    try {
      // 1️⃣ Try staff/admin login
      let response = await axios.post("http://localhost:5000/api/staff/login", { email, password });
      setCurrentUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;

    } catch (staffErr) {
      // 2️⃣ If staff login fails, try regular user login
      try {
        let response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
        setCurrentUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;

      } catch (userErr) {
        // Both logins failed
        return { 
          success: false, 
          message: staffErr.response?.data?.message || 
                   userErr.response?.data?.message || 
                   "Invalid email or password"
        };
      }
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Update profile example
const updateProfile = async (updatedData, currentUserId) => {
  const payload = { ...updatedData, userId: currentUserId };
  const response = await fetch('http://localhost:5000/api/users/editUsers', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await response.json();
};


  return (
    <AuthContext.Provider value={{ currentUser, loading, register, loginCombined, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);