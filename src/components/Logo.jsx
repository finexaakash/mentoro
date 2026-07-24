function Logo({ width = "120px", showText = true }) {
  return (
    <div className="flex items-center gap-2 group" aria-label="Mentoro">
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label="Mentoro logo"
        style={{ width, height: "auto" }}
        className="shrink-0 drop-shadow-[0_0_10px_rgba(129,140,248,0.45)] transition duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="mentoro-logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path d="M6 11.5 24 3l18 8.5v23L24 45 6 34.5v-23Z" fill="url(#mentoro-logo-gradient)" />
        <path d="m12 16 12 7 12-7v15l-12 7-12-7V16Z" fill="#0f172a" opacity=".9" />
        <path d="M15 16v13l9-5.2L33 29V16l-9 5-9-5Z" fill="#eef2ff" />
        <circle cx="24" cy="14" r="3" fill="#f8fafc" />
      </svg>
      {showText && <span className="text-xl font-bold tracking-wide text-white transition group-hover:text-indigo-200">Mentoro</span>}
    </div>
  );
}

export default Logo;
