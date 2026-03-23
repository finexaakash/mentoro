

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

// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { account } from "../lib/appwrite";

// const TeacherDashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   const AUTH_KEY = "auth-cache";
//   const AUTH_TIME = 10 * 60 * 1000; // 10 min

//   useEffect(() => {
//     const checkAuth = async () => {
//       const cache = JSON.parse(localStorage.getItem(AUTH_KEY));

//       // ✅ USE CACHE (NO API CALL)
//       if (cache && Date.now() - cache.timestamp < AUTH_TIME) {
//         setLoading(false);
//         return;
//       }

//       try {
//         await account.get();

//         // ✅ SAVE CACHE
//         localStorage.setItem(
//           AUTH_KEY,
//           JSON.stringify({
//             isAuth: true,
//             timestamp: Date.now(),
//           })
//         );

//       } catch {
//         localStorage.removeItem(AUTH_KEY);
//         navigate("/login");
//         return;
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const types = [
//     { key: "notes", label: "Notes", icon: "📒" },
//     { key: "books", label: "Books", icon: "📚" },
//     { key: "videos", label: "Videos", icon: "🎥" },
//     { key: "links", label: "Links", icon: "🔗" },
//   ];

//   // 🔄 Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">Checking access...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-12">

//       {/* HEADER */}
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-bold">Teacher Dashboard 🚀</h1>
//         <p className="text-gray-400 mt-2">
//           Manage and upload your resources
//         </p>
//       </div>

//       {/* CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
//         {types.map((type) => (
//           <div
//             key={type.key}
//             onClick={() => navigate(`/resources/${type.key}`)}
//             className="
//               group cursor-pointer p-8 rounded-2xl
//               bg-white/5 backdrop-blur
//               border border-white/10
//               hover:scale-[1.05] hover:shadow-2xl
//               transition duration-300
//               relative overflow-hidden
//             "
//           >
//             {/* Glow */}
//             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition blur-xl"></div>

//             {/* Content */}
//             <div className="relative z-10 text-center">
//               <div className="text-4xl mb-3">{type.icon}</div>

//               <h2 className="text-xl font-semibold group-hover:text-indigo-400 transition">
//                 {type.label}
//               </h2>

//               <p className="text-sm text-gray-400 mt-2">
//                 Add & manage {type.label.toLowerCase()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;