import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const data = await api.get("/auth/me");

      console.log("ME RESPONSE:", data);

      const currentUser =
        data.user || data.data?.user || data;

      setUser(currentUser);
    } catch (error) {
      console.error("Auth error:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", data);

    if (!data.token) {
      throw new Error(
        "Login successful but token was not returned"
      );
    }

    localStorage.setItem("token", data.token);

    const loggedUser =
      data.user || data.data?.user;

    if (!loggedUser) {
      throw new Error(
        "Login successful but user data was not returned"
      );
    }

    setUser(loggedUser);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}