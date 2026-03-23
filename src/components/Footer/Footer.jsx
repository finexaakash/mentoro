

import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="relative mt-20 text-gray-400">

      {/* 🔥 BACKGROUND GRADIENT (MATCH APP) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]"></div>

      {/* 🔥 TOP GLOW */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">

        {/* 🔥 TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* LOGO + TEXT */}
          <div className="text-center md:text-left">
            <Logo width="80px" />

            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              A smart learning hub for students to access notes, books,
              videos and academic resources.
            </p>
          </div>

          {/* NAV LINKS */}
          <nav>
            <ul className="flex gap-8 text-sm font-medium">

              {[
                { name: "Home", path: "/" },
                { name: "Teachers", path: "/teachers" },
                // { name: "Dashboard", path: "/dashboard" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="
                      relative text-gray-400 hover:text-white
                      transition duration-300
                      group
                    "
                  >
                    {item.name}

                    {/* underline animation */}
                    <span className="
                      absolute left-0 -bottom-1 w-0 h-[2px]
                      bg-indigo-400
                      transition-all duration-300
                      group-hover:w-full
                    "></span>
                  </Link>
                </li>
              ))}

            </ul>
          </nav>
        </div>

        {/* 🔥 DIVIDER */}
        <div className="border-t border-white/10 my-8"></div>

        {/* 🔥 BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} Target World. All rights reserved.
          </p>

          {/* OPTIONAL SOCIAL / EXTRA */}
          <div className="flex gap-4">
            <span className="hover:text-indigo-400 cursor-pointer transition">Privacy</span>
            <span className="hover:text-indigo-400 cursor-pointer transition">Terms</span>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;