

import { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authslice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    try {
      setLoading(true);

      await authService.logout();
      dispatch(logout());

      // 🔥 Redirect to HOME
      window.location.href = "/";

    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={logoutHandler}
      disabled={loading}
      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        loading
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-red-500/90 text-white hover:bg-red-600 active:scale-95"
      }`}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

export default LogoutBtn;