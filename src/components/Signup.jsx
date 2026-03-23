

import { useState, useRef } from "react";
import authService from "../appwrite/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authslice.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // 🔥 LOCK
  const lockRef = useRef(false);

  const passwordValue = watch("password");

  const getStrength = (pass) => {
    if (!pass) return "";
    if (pass.length < 6) return "Weak";
    if (pass.length < 10) return "Medium";
    return "Strong";
  };

  const create = async (data) => {
    // 🚫 block multiple clicks
    if (lockRef.current) return;

    lockRef.current = true;
    setError("");
    setLoading(true);

    try {
      // ✅ SINGLE API CALL (optimized)
      const userData = await authService.createAccount(data);

      if (!userData) throw new Error("Signup failed");

      dispatch(login(userData));

      // optional cache
      localStorage.setItem("auth-cache", JSON.stringify(userData));

      navigate("/");

    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
      lockRef.current = false; // 🔓 unlock
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="
        w-full max-w-md p-8 rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_0_40px_rgba(0,0,0,0.4)]
      ">

        {/* Title */}
        <div className="flex justify-center mb-6">
          <h1 className="text-xl font-semibold text-white">
            Create Account 🚀
          </h1>
        </div>

        <p className="text-center text-gray-400 text-sm mb-4">
          Join UIET platform and start sharing knowledge
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(create)} className="space-y-5">

          {/* Name */}
          <input
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="
              w-full p-3 rounded-lg
              bg-transparent border border-white/20
              text-white placeholder-gray-400
              focus:border-indigo-400 outline-none
            "
          />
          {errors.name && (
            <p className="text-red-400 text-xs">{errors.name.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="
              w-full p-3 rounded-lg
              bg-transparent border border-white/20
              text-white placeholder-gray-400
              focus:border-indigo-400 outline-none
            "
          />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email.message}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              className="
                w-full p-3 rounded-lg
                bg-transparent border border-white/20
                text-white placeholder-gray-400
                focus:border-indigo-400 outline-none
              "
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password.message}</p>
          )}

          {/* Strength */}
          {passwordValue && (
            <div className="text-sm">
              Strength:{" "}
              <span
                className={`font-semibold ${
                  getStrength(passwordValue) === "Weak"
                    ? "text-red-400"
                    : getStrength(passwordValue) === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {getStrength(passwordValue)}
              </span>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-lg font-medium transition text-white
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }
            `}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;