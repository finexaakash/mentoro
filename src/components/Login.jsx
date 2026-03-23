
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login as authLogin } from "../store/authslice";
// import { Button, Input, Logo } from "./index";
// import { useDispatch } from "react-redux";
// import authService from "../appwrite/auth";
// import { useForm } from "react-hook-form";

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const login = async (data) => {
//     setError("");
//     setLoading(true);

//     try {
//       const session = await authService.login(data);

//       if (session) {
//         const userData = await authService.getCurrentUser();
//         if (userData) {
//   dispatch(authLogin(userData));

//   // Force full refresh
//   window.location.href = "/";
// }

//       }
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };
// return (
// <div className="min-h-screen flex items-center justify-center p-4">

//       {/* Card */}
//       <div className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl rounded-2xl p-10 border border-white/40">

//         {/* Logo */}
//         <div className="flex justify-center mb-5">
//           <Logo width="90px" />
//         </div>
//         {/* Title */}
//         <h2 className="text-center text-3xl font-bold text-gray-800">
//           Welcome Back 👋
//         </h2>

//         <p className="mt-2 text-center text-gray-500">
//           Sign in to continue
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">

//           {/* Email */}
//           <Input
//             label="Email"
//             placeholder="Enter your email"
//             type="email"
//             error={errors.email?.message}
//             {...register("email", {
//               required: "Email is required",
//               pattern: {
//                 value:
//                   /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//                 message: "Enter a valid email",
//               },
//             })}
//           />

//           {/* Password */}
//           <Input
//             label="Password"
//             type={showPass ? "text" : "password"}
//             placeholder="Enter your password"
//             error={errors.password?.message}
//             rightIcon={
//               <button
//                 type="button"
//                 onClick={() => setShowPass(!showPass)}
//                 className="text-xs text-blue-600 font-semibold"
//               >
//                 {showPass ? "Hide" : "Show"}
//               </button>
//             }
//             {...register("password", {
//               required: "Password is required",
//             })}
//           />

//           {/* Button */}
//           <Button
//             type="submit"
//             loading={loading}
//             className="w-full text-lg"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link
//             to="/signup"
//             className="font-semibold text-blue-600 hover:underline"
//           >
//             Create account
//           </Link>
//         </p>
//       </div>
//       </div>
//    );
//   }
// export default Login;


// src/components/Login.jsx

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login as authLogin } from "../store/authslice";
// import { Button, Input, Logo } from "./index";
// import { useDispatch } from "react-redux";
// import authService from "../appwrite/auth";
// import { useForm } from "react-hook-form";

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const login = async (data) => {
//     setError("");
//     setLoading(true);

//     try {
//       // 🔥 Step 1: Create session
//       await authService.login(data);

//       // 🔥 Step 2: Ensure session is active
//       const userData = await authService.getCurrentUser();

//       if (userData) {
//         console.log("✅ LOGIN SUCCESS:", userData);

//         // 🔥 Step 3: Save in Redux
//         dispatch(authLogin(userData));

//         // 🔥 Step 4: Navigate (NO reload)
//         navigate("/profile");
//       } else {
//         throw new Error("User not found after login");
//       }
//     } catch (err) {
//       console.log("❌ LOGIN ERROR:", err);
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       {/* Card */}
//       <div className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl rounded-2xl p-10 border border-white/40">
        
//         {/* Logo */}
//         <div className="flex justify-center mb-5">
//           <Logo width="90px" />
//         </div>

//         {/* Title */}
//         <h2 className="text-center text-3xl font-bold text-gray-800">
//           Welcome Back 👋
//         </h2>

//         <p className="mt-2 text-center text-gray-500">
//           Sign in to continue
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">

//           {/* Email */}
//           <Input
//             label="Email"
//             placeholder="Enter your email"
//             type="email"
//             error={errors.email?.message}
//             {...register("email", {
//               required: "Email is required",
//               pattern: {
//                 value:
//                   /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//                 message: "Enter a valid email",
//               },
//             })}
//           />

//           {/* Password */}
//           <Input
//             label="Password"
//             type={showPass ? "text" : "password"}
//             placeholder="Enter your password"
//             error={errors.password?.message}
//             rightIcon={
//               <button
//                 type="button"
//                 onClick={() => setShowPass(!showPass)}
//                 className="text-xs text-blue-600 font-semibold"
//               >
//                 {showPass ? "Hide" : "Show"}
//               </button>
//             }
//             {...register("password", {
//               required: "Password is required",
//             })}
//           />

//           {/* Button */}
//           <Button
//             type="submit"
//             loading={loading}
//             className="w-full text-lg"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link
//             to="/signup"
//             className="font-semibold text-blue-600 hover:underline"
//           >
//             Create account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login as authLogin } from "../store/authslice";
// import { Button, Input, Logo } from "./index";
// import { useDispatch } from "react-redux";
// import authService from "../appwrite/auth";
// import { useForm } from "react-hook-form";

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const login = async (data) => {
//     setError("");
//     setLoading(true);

//     try {
//       await authService.login(data);
//       const userData = await authService.getCurrentUser();

//       if (userData) {
//         dispatch(authLogin(userData));
//         navigate("/profile");
//       } else {
//         throw new Error("User not found");
//       }
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-6">

//       {/* 🔥 CARD */}
//       <div className="
//         w-full max-w-md p-8 rounded-2xl
//         bg-white/5 backdrop-blur-xl
//         border border-white/10
//         shadow-[0_0_40px_rgba(0,0,0,0.4)]
//       ">

//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <Logo width="80px" />
//         </div>

//         {/* Title */}
//         <h2 className="text-center text-2xl font-semibold text-white">
//           Welcome Back 👋
//         </h2>

//         <p className="mt-2 text-center text-gray-400 text-sm">
//           Sign in to continue
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="mt-4 bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">

//           {/* Email */}
//           <input
//             type="email"
//             placeholder="Email"
//             {...register("email", { required: true })}
//             className="
//               w-full p-3 rounded-lg
//               bg-transparent border border-white/20
//               text-white placeholder-gray-400
//               focus:border-indigo-400 outline-none
//             "
//           />

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               {...register("password", { required: true })}
//               className="
//                 w-full p-3 rounded-lg
//                 bg-transparent border border-white/20
//                 text-white placeholder-gray-400
//                 focus:border-indigo-400 outline-none
//               "
//             />

//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
//             >
//               {showPass ? "Hide" : "Show"}
//             </button>
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="
//               w-full py-3 rounded-lg
//               bg-indigo-500 text-white font-medium
//               hover:bg-indigo-600
//               transition
//             "
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-sm text-gray-400">
//           Don’t have an account?{" "}
//           <Link
//             to="/signup"
//             className="text-indigo-400 hover:underline"
//           >
//             Create account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authslice";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { Logo } from "./index";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // 🔥 INSTANT LOCK (prevents multiple clicks)
  const lockRef = useRef(false);

  const login = async (data) => {
    // 🚫 block if already processing
    if (lockRef.current) return;

    lockRef.current = true; // 🔒 lock instantly
    setError("");
    setLoading(true);

    try {
      // ✅ SINGLE API CALL (optimized)
      const userData = await authService.login(data);

      if (!userData) throw new Error("User not found");

      // Redux update
      dispatch(authLogin(userData));

      // Optional: cache auth (if you use it)
      localStorage.setItem("auth-cache", JSON.stringify(userData));

      navigate("/profile");

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
      lockRef.current = false; // 🔓 unlock
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      {/* CARD */}
      <div className="
        w-full max-w-md p-8 rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_0_40px_rgba(0,0,0,0.4)]
      ">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo width="80px" />
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-white">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-center text-gray-400 text-sm">
          Sign in to continue
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">

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
              {...register("password", { required: "Password is required" })}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-lg font-medium transition
              ${loading 
                ? "bg-indigo-400 cursor-not-allowed" 
                : "bg-indigo-500 hover:bg-indigo-600"
              }
              text-white
            `}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;