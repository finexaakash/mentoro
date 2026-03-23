function Logo({ width = "120px", showText = true }) {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">

      {/* Logo Image */}
      <img
        src="eca7f6d8-1a4d-4e7f-b85f-3227ae8cd4f4-removebg-preview.png"
        alt="logo"
        style={{ width }}
        className="transition duration-300 group-hover:scale-110 drop-shadow-md"
      />

      {/* Brand Name */}
      {showText && (
        <span className="text-xl font-bold tracking-wide text-white-800 group-hover:text-blue-600 transition">
         
        </span>
      )}
    </div>
  );
}

export default Logo;