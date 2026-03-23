// import { useState } from "react";
// import authService from "../appwrite/auth.js";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../store/authslice.js";
// import { Button, Input, Logo } from "./index.jsx";
// import { useDispatch } from "react-redux";
// import { useForm } from "react-hook-form";
// function Signup() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const passwordValue = watch("password");

//   // password strength
//   const getStrength = (pass) => {
//     if (!pass) return "";
//     if (pass.length < 6) return "Weak";
//     if (pass.length < 10) return "Medium";
//     return "Strong";
//   };

//   const create = async (data) => {
//     setError("");
//     setLoading(true);

//     try {
//       const user = await authService.createAccount(data);
//       if (user) {
//         const userData = await authService.getCurrentUser();
//         if (userData) dispatch(login(userData));
//         navigate("/");
//       }
//     } catch (err) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };
//     return (
//     <div className="min-h-screen flex items-center justify-center p-4">

//       {/* Card */}
//       <div className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl rounded-2xl p-10 border border-white/40">

//         {/* Logo */}
//         <div className="flex justify-center mb-5">
//           <Logo width="90px" />
//         </div>

//         {/* Heading */}
//         <h2 className="text-3xl font-bold text-center text-gray-800">
//           Create Account 🚀
//         </h2>

//         <p className="mt-2 text-center text-gray-500">
//           Join us and start your journey
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="mt-5 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(create)} className="mt-6 space-y-5">

//           {/* Name */}
//           <Input
//             label="Full Name"
//             placeholder="Enter your full name"
//             error={errors.name?.message}
//             {...register("name", { required: "Name is required" })}
//           />

//           {/* Email */}
//           <Input
//             label="Email"
//             type="email"
//             placeholder="Enter your email"
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
//               minLength: {
//                 value: 6,
//                 message: "Minimum 6 characters",
//               },
//             })}
//           />

//           {/* Password strength */}
//           {passwordValue && (
//             <div className="text-sm">
//               Strength:{" "}
//               <span
//                 className={`font-semibold ${
//                   getStrength(passwordValue) === "Weak"
//                     ? "text-red-500"
//                     : getStrength(passwordValue) === "Medium"
//                     ? "text-yellow-500"
//                     : "text-green-600"
//                 }`}
//               >
//                 {getStrength(passwordValue)}
//               </span>
//             </div>
//           )}

//           {/* Button */}
//           <Button
//             type="submit"
//             loading={loading}
//             className="w-full text-lg"
//           >
//             {loading ? "Creating..." : "Create Account"}
//           </Button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-semibold text-blue-600 hover:underline"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;


// import { useState } from "react";
// import authService from "../appwrite/auth.js";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../store/authslice.js";
// import { useDispatch } from "react-redux";
// import { useForm } from "react-hook-form";

// function Signup() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const passwordValue = watch("password");

//   // 🔥 Password strength
//   const getStrength = (pass) => {
//     if (!pass) return "";
//     if (pass.length < 6) return "Weak";
//     if (pass.length < 10) return "Medium";
//     return "Strong";
//   };

//   const create = async (data) => {
//     setError("");
//     setLoading(true);

//     try {
//       const user = await authService.createAccount(data);

//       if (user) {
//         const userData = await authService.getCurrentUser();
//         if (userData) dispatch(login(userData));
//         navigate("/");
//       }
//     } catch (err) {
//       setError(err.message || "Signup failed");
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
//           <h1 className="text-xl font-semibold text-white">
//             Create Account 🚀
//           </h1>
//         </div>

//         {/* Subtitle */}
//         <p className="text-center text-gray-400 text-sm mb-4">
//           Join UIET platform and start sharing knowledge
//         </p>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20 mb-4">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(create)} className="space-y-5">

//           {/* Name */}
//           <input
//             placeholder="Full Name"
//             {...register("name", { required: true })}
//             className="
//               w-full p-3 rounded-lg
//               bg-transparent border border-white/20
//               text-white placeholder-gray-400
//               focus:border-indigo-400 outline-none
//             "
//           />

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

//           {/* 🔥 Password Strength */}
//           {passwordValue && (
//             <div className="text-sm">
//               Strength:{" "}
//               <span
//                 className={`font-semibold ${
//                   getStrength(passwordValue) === "Weak"
//                     ? "text-red-400"
//                     : getStrength(passwordValue) === "Medium"
//                     ? "text-yellow-400"
//                     : "text-green-400"
//                 }`}
//               >
//                 {getStrength(passwordValue)}
//               </span>
//             </div>
//           )}

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
//             {loading ? "Creating..." : "Create Account"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-sm text-gray-400">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-indigo-400 hover:underline"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;






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