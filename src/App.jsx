

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authslice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import { Query } from "appwrite";
import { databases } from "./lib/appwrite";
import conf from "./conf/conf";

function App() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(async (userData) => {
        if (!userData) {
          dispatch(logout());
          return;
        }

        // Older accounts did not have a role preference. Classify them once
        // so the header and routes can reliably distinguish students.
        if (!userData.prefs?.role) {
          try {
            const profiles = await databases.listDocuments(
              conf.appwriteDatabaseId,
              conf.appwriteCollectionId,
              [Query.equal("userId", userData.$id), Query.limit(1)]
            );
            userData = await authService.updatePreferences({
              role: profiles.total > 0 ? "teacher" : "student",
            });
          } catch (error) {
            console.warn("Could not classify account role:", error);
          }
        }

        dispatch(login({ userData }));
      })
      .catch(() => dispatch(logout()))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setMounted(true), 150);
      });
  }, [dispatch]);

  // 🔥 FULLSCREEN DARK LOADER
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-center space-y-4">
          
          {/* Spinner */}
          <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          {/* Text */}
          <p className="text-gray-400 font-medium">
            Loading Target World...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen flex flex-col
        bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]
        transition-opacity duration-700
        ${mounted ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* 🔥 HEADER */}
      <Header />

      {/* 🔥 MAIN CONTENT */}
      <main className="flex-grow w-full px-4 md:px-8 lg:px-12 py-4">
        <Outlet />
      </main>

      {/* 🔥 FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
