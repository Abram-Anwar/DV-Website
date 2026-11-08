import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);

  // Runs once when the app opens: ask the server if we are logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/me`, {
          credentials: "include",
        });

        if (response.ok) {
          setAdmin(await response.json());
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.log(error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (adminData) => setAdmin(adminData);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    }
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
