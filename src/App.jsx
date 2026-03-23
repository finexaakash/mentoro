// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import "./App.css";
// import authService from "./appwrite/auth";
// import { login, logout } from "./store/authslice";
// import { Footer, Header } from "./components";
// import { Outlet } from "react-router-dom";
// function App() {
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     authService
//       .getCurrentUser()
//       .then((userData) => {
//         if (userData) dispatch(login({ userData} ) );
       

//         else dispatch(logout());
//       })
      
//       .finally(() => {
//         setLoading(false);
//         setTimeout(() => setMounted(true), 100);
//       });
//   }, [dispatch]);

//   // Fullscreen Loader
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
//         <div className="text-center space-y-4">
//           <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="text-gray-600 font-medium">Loading application...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div
//       className={`
//         min-h-screen flex flex-col
//         bg-gradient-to-b from-gray-50 via-white to-gray-100
//         transition-opacity duration-700
//         ${mounted ? "opacity-100" : "opacity-0"}
//       `}
//     >
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <main className="flex-grow px-2 md:px-4 lg:px-6 transition-all duration-300">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }
// export default App;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authslice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else dispatch(logout());
      })
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