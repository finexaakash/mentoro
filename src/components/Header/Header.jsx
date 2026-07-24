

import { Logo, LogoutBtn } from "../index";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const isStudent = userData?.prefs?.role === "student";
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Teachers", slug: "/teachers", active: true },
    { name: "Bookmarks", slug: "/bookmarks", active: authStatus && isStudent },
    { name: "Dashboard", slug: "/dashboard", active: authStatus && !isStudent },
    { name: "Profile", slug: "/profile", active: authStatus && !isStudent },
    // { name: "Login", slug: "/login", active: !authStatus },
    // { name: "Signup", slug: "/signup", active: !authStatus },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">

      <div className="w-full px-6 md:px-12">
        <nav className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo width="45px" showText={false} />
            <span className="text-white font-semibold text-lg hidden sm:block">
              Mentoro
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6">

            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      // className="relative text-sm font-medium text-white-400 hover:text-white transition"
                      className="relative text-sm font-medium text-white  hover:text-indigo-400 transition-all duration-300"
                    >
                      {item.name}

                      {/* 🔥 underline animation */}
                      <span
                        className={`
                          absolute left-0 -bottom-1 h-[2px] w-full bg-indigo-500
                          transition-transform duration-300 origin-left
                          ${
                            location.pathname === item.slug
                              ? "scale-x-100"
                              : "scale-x-0"
                          }
                        `}
                      ></span>
                    </button>
                  </li>
                )
            )}

            {authStatus && (
              <li className="ml-4 flex items-center gap-3">
                {isStudent && <span className="max-w-32 truncate text-sm font-medium text-indigo-200">Hi, {userData?.name}</span>}
                <LogoutBtn />
              </li>
            )}
            {!authStatus && (
              <li className="flex items-center gap-3">
                <Link to="/student/login" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">Student login</Link>
                {/* <Link to="/student/signup" className="text-sm font-medium text-indigo-300 hover:text-white">Student signup</Link> */}
              </li>
            )}
          </ul>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden transition-all duration-300 overflow-hidden
            ${menuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"}
          `}
        >
          <ul className="flex flex-col gap-2 bg-[#020617] border border-white/10 rounded-xl p-3">

            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setMenuOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg
                        ${
                          location.pathname === item.slug
                            ? "text-white bg-white/5"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && (
              <li className="pt-2">
                {isStudent && <p className="mb-2 px-4 text-sm text-indigo-200">Hi, {userData?.name}</p>}
                <LogoutBtn />
              </li>
            )}
            {!authStatus && (
              <li className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/student/login" onClick={() => setMenuOpen(false)} className="rounded-lg bg-indigo-500 px-4 py-3 text-center text-sm text-white">Student login</Link>
                <Link to="/student/signup" onClick={() => setMenuOpen(false)} className="rounded-lg border border-indigo-400/50 px-4 py-3 text-center text-sm text-indigo-200">Student signup</Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* subtle glow line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
    </header>
  );
}

export default Header;
