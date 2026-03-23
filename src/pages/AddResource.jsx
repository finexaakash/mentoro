
import { useForm } from "react-hook-form";
import { databases, account } from "../lib/appwrite";
import conf from "../conf/conf";
import { ID, Query } from "appwrite";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const AddResource = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [remaining, setRemaining] = useState(null);

  const lastSubmitRef = useRef(0);

  const AUTH_KEY = "auth-cache";
  const LOCK_KEY = "add-resource-lock";
  const LIMIT_CACHE_KEY = "daily-limit-cache";

  const CACHE_TIME = 10 * 60 * 1000;
  const LIMIT_CACHE_TIME = 60 * 1000; // 1 min
  const COOLDOWN = 5000;

  const DAILY_LIMIT = 20;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🔒 AUTH CHECK
  useEffect(() => {
    const check = async () => {
      try {
        const cache = JSON.parse(localStorage.getItem(AUTH_KEY));

        if (cache && Date.now() - cache.timestamp < CACHE_TIME) return;

        const user = await account.get();

        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({ user, timestamp: Date.now() })
        );
      } catch {
        navigate("/login");
      }
    };

    check();
  }, []);

  // 🔥 GET DAILY COUNT (ONLY ONCE)
  useEffect(() => {
    const checkLimit = async () => {
      try {
        const cache = JSON.parse(localStorage.getItem(AUTH_KEY));
        let user;

        if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
          user = cache.user;
        } else {
          user = await account.get();
        }

        // ✅ CHECK LIMIT CACHE FIRST
        const limitCache = JSON.parse(localStorage.getItem(LIMIT_CACHE_KEY));

        if (
          limitCache &&
          Date.now() - limitCache.timestamp < LIMIT_CACHE_TIME
        ) {
          const remainingUploads = DAILY_LIMIT - limitCache.count;

          setRemaining(remainingUploads);
          setLimitReached(limitCache.count >= DAILY_LIMIT);
          return;
        }

        // 🔥 ONLY API CALL (once)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const res = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteResourcesCollectionId,
          [
            Query.equal("userId", user.$id),
            Query.greaterThanEqual("$createdAt", startOfDay.toISOString()),
          ]
        );

        // 💾 SAVE CACHE
        localStorage.setItem(
          LIMIT_CACHE_KEY,
          JSON.stringify({
            count: res.total,
            timestamp: Date.now(),
          })
        );

        const remainingUploads = DAILY_LIMIT - res.total;

        setRemaining(remainingUploads);
        setLimitReached(res.total >= DAILY_LIMIT);

      } catch (err) {
        console.log(err);
      }
    };

    checkLimit();
  }, []);

  // 🔥 SUBMIT (OPTIMIZED)
  const submit = async (data) => {
    const now = Date.now();

    if (loading) return;

    if (now - lastSubmitRef.current < COOLDOWN) {
      alert("⏳ Wait before submitting again");
      return;
    }

    const existingLock = localStorage.getItem(LOCK_KEY);
    if (existingLock && now - Number(existingLock) < COOLDOWN) {
      alert("🚫 Too many requests");
      return;
    }

    // 🔥 CHECK CACHE ONLY (NO API)
    const limitCache = JSON.parse(localStorage.getItem(LIMIT_CACHE_KEY));

    if (limitCache && limitCache.count >= DAILY_LIMIT) {
      alert("🚫 Daily limit reached");
      setLimitReached(true);
      return;
    }

    lastSubmitRef.current = now;
    localStorage.setItem(LOCK_KEY, now.toString());
    setLoading(true);

    try {
      let user;
      const cache = JSON.parse(localStorage.getItem(AUTH_KEY));

      if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
        user = cache.user;
      } else {
        user = await account.get();
      }

      // ✅ ONLY API CALL NOW
      await databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        ID.unique(),
        {
          title: data.title,
          description: data.description,
          link: data.link,
          type,
          userId: user.$id,
        }
      );

      // 🔥 UPDATE CACHE (NO API NEEDED)
      if (limitCache) {
        const newCount = limitCache.count + 1;

        localStorage.setItem(
          LIMIT_CACHE_KEY,
          JSON.stringify({
            count: newCount,
            timestamp: Date.now(),
          })
        );

        setRemaining(DAILY_LIMIT - newCount);

        if (newCount >= DAILY_LIMIT) {
          setLimitReached(true);
        }
      }

      // 🧹 CLEAR RESOURCE CACHE
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith(`resources-${type}`) ||
          key.startsWith(`my-resources-${type}`)
        ) {
          localStorage.removeItem(key);
        }
      });

      navigate(`/resources/${type}`);

    } catch (error) {
      console.log(error);
      alert("Failed to add resource");
    } finally {
      setLoading(false);

      setTimeout(() => {
        localStorage.removeItem(LOCK_KEY);
      }, COOLDOWN);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-white">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-xl">

        <h2 className="text-2xl font-bold mb-4">Add {type}</h2>

        {remaining !== null && (
          <p className="text-gray-400 mb-2">
            Remaining today: {remaining}
          </p>
        )}

        {limitReached && (
          <p className="text-red-400 mb-2">
            🚫 Daily limit reached
          </p>
        )}

        <input {...register("title", { required: true })} placeholder="Title" className="w-full p-3 mb-3 bg-transparent border border-white/20 rounded" />

        <textarea {...register("description", { required: true })} placeholder="Description" className="w-full p-3 mb-3 bg-transparent border border-white/20 rounded" />

        <input {...register("link", { required: true })} placeholder="Link" className="w-full p-3 mb-4 bg-transparent border border-white/20 rounded" />

        
        <button
  type="submit"
  disabled={loading || limitReached}
  className={`
    w-full py-3 rounded font-medium transition duration-300

    ${
      loading || limitReached
        ? "bg-indigo-400 cursor-not-allowed opacity-70"
        : "bg-indigo-500 hover:bg-indigo-600 "
    }
  `}
>
  {loading ? "Saving..." : limitReached ? "Limit Reached" : "Save"}
</button>

      </form>
    </div>
  );
};

export default AddResource;