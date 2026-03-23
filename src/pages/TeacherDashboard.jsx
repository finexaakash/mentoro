

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { account } from "../lib/appwrite";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  // 🔒 Protect route
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  const types = [
    { key: "notes", label: "Notes", icon: "📒" },
    { key: "books", label: "Books", icon: "📚" },
    { key: "videos", label: "Videos", icon: "🎥" },
    { key: "links", label: "Links", icon: "🔗" },
  ];

  return (
    <div className="min-h-screen  text-white px-6 py-12">

      {/* 🔥 HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Teacher Dashboard 🚀</h1>
        <p className="text-gray-400 mt-2">
          Manage and upload your resources
        </p>
      </div>

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">

        {types.map((type) => (
          <div
            key={type.key}
            onClick={() => navigate(`/resources/${type.key}`)}
            className="
              group cursor-pointer p-8 rounded-2xl
              bg-white/5 backdrop-blur
              border border-white/10
              hover:scale-[1.05] hover:shadow-2xl
              transition duration-300
              relative overflow-hidden
            "
          >
            {/* 🔥 glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition blur-xl"></div>

            {/* content */}
            <div className="relative z-10 text-center">
              
              <div className="text-4xl mb-3">{type.icon}</div>

              <h2 className="text-xl font-semibold group-hover:text-indigo-400 transition">
                {type.label}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Add & manage {type.label.toLowerCase()}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default TeacherDashboard;
