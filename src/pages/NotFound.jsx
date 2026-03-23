import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6">

      <h1 className="text-6xl font-bold text-indigo-500">404</h1>

      <h2 className="text-2xl mt-4 font-semibold">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-2 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="
          mt-6 px-6 py-2
          bg-indigo-500 hover:bg-indigo-600
          rounded-lg font-medium
          transition
        "
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;