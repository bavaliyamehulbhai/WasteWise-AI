import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser =
      sessionStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const updateUser = (userData) => {
    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = async () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);

    // Phase 19: Clear sensitive offline data when logging out
    try {
      // 1. Clear IndexedDB
      const { clearAllOfflineData } = await import("../services/offlineDb.js");
      await clearAllOfflineData();

      // 2. Clear API Cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      }
    } catch (e) {
      console.error("Failed to clean up offline data during logout", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
