// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { useParams, useNavigate } from "react-router-dom";

// const EditResource = () => {
//   const { id, type } = useParams();
//   const { register, handleSubmit, setValue } = useForm();
//   const navigate = useNavigate();

//   // 🔥 Fetch existing data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const doc = await databases.getDocument(
//           conf.appwriteDatabaseId,
//           conf.appwriteResourcesCollectionId,
//           id
//         );

//         setValue("title", doc.title);
//         setValue("description", doc.description);
//         setValue("link", doc.link);

//       } catch (error) {
//         console.log("Fetch error:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // 🔥 Update resource
//   const submit = async (data) => {
//     try {
//       await databases.updateDocument(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         id,
//         {
//           title: data.title,
//           description: data.description,
//           link: data.link,
//         }
//       );

//       navigate(`/resources/${type}`);

//     } catch (error) {
//       console.log("Update error:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-6 text-white">

//       <form
//         onSubmit={handleSubmit(submit)}
//         className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-xl space-y-4"
//       >
//         <h2 className="text-xl font-semibold">Edit {type}</h2>

//         <input
//           placeholder="Title"
//           {...register("title", { required: true })}
//           className="w-full p-3 bg-transparent border border-white/20 rounded"
//         />

//         <textarea
//           placeholder="Description"
//           {...register("description")}
//           className="w-full p-3 bg-transparent border border-white/20 rounded"
//         />

//         <input
//           placeholder="Link"
//           {...register("link", { required: true })}
//           className="w-full p-3 bg-transparent border border-white/20 rounded"
//         />

//         <button className="w-full bg-indigo-500 py-2 rounded-lg">
//           Update
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditResource;



// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { useParams, useNavigate } from "react-router-dom";

// const EditResource = () => {
//   const { id, type } = useParams();
//   const { register, handleSubmit, setValue } = useForm();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const CACHE_KEY = `edit-${id}`;
//   const CACHE_TIME = 5 * 60 * 1000;

//   // 🔥 FETCH DATA (WITH CACHE)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

//         // ✅ USE CACHE
//         if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//           setValue("title", cache.data.title);
//           setValue("description", cache.data.description);
//           setValue("link", cache.data.link);
//           setLoading(false);
//           return;
//         }

//         // ✅ API CALL ONLY IF NEEDED
//         const doc = await databases.getDocument(
//           conf.appwriteDatabaseId,
//           conf.appwriteResourcesCollectionId,
//           id
//         );

//         setValue("title", doc.title);
//         setValue("description", doc.description);
//         setValue("link", doc.link);

//         // ✅ SAVE CACHE
//         localStorage.setItem(
//           CACHE_KEY,
//           JSON.stringify({
//             data: doc,
//             timestamp: Date.now(),
//           })
//         );

//       } catch (error) {
//         console.log("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // 🔥 UPDATE RESOURCE
//   const submit = async (data) => {
//     if (saving) return; // 🔥 prevent spam

//     setSaving(true);

//     try {
//       await databases.updateDocument(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         id,
//         {
//           title: data.title,
//           description: data.description,
//           link: data.link,
//         }
//       );

//       // 🔥 CLEAR ALL RELATED CACHE
//       localStorage.removeItem(CACHE_KEY);
//       localStorage.removeItem(`resources-${type}`);
//       localStorage.removeItem(`my-resources-${type}`);

//       navigate(`/resources/${type}`);

//     } catch (error) {
//       console.log("Update error:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-6 text-white">

//       <form
//         onSubmit={handleSubmit(submit)}
//         className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-xl space-y-4"
//       >
//         <h2 className="text-xl font-semibold">Edit {type}</h2>

//         <input
//           placeholder="Title"
//           {...register("title", { required: true })}
//           className="w-full p-3 bg-transparent border border-white/20 rounded"
//         />

//         <textarea
//           placeholder="Description"
//           {...register("description")}
//           className="w-full p-3 bg-transparent border border-white/20 rounded"
//         />

//         <input
//           placeholder="Link"
//           {...register("link", { required: true })}
//           className="w-full p-3 bg-transparent border border-white/20 rounded"
//         />

//         <button
//           disabled={saving}
//           className="w-full bg-indigo-500 py-2 rounded-lg"
//         >
//           {saving ? "Updating..." : "Update"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditResource;

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { databases } from "../lib/appwrite";
import conf from "../conf/conf";
import { useParams, useNavigate } from "react-router-dom";

const EditResource = () => {
  const { id, type } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔥 LOCK SYSTEM
  const lastSubmitRef = useRef(0);
  const LOCK_KEY = `edit-lock-${id}`;
  const COOLDOWN = 5000;

  const CACHE_KEY = `edit-${id}`;
  const CACHE_TIME = 5 * 60 * 1000;

  // 🔥 FETCH DATA (WITH CACHE)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

        if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
          setValue("title", cache.data.title);
          setValue("description", cache.data.description);
          setValue("link", cache.data.link);
          setLoading(false);
          return;
        }

        const doc = await databases.getDocument(
          conf.appwriteDatabaseId,
          conf.appwriteResourcesCollectionId,
          id
        );

        setValue("title", doc.title);
        setValue("description", doc.description);
        setValue("link", doc.link);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: doc,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔥 UPDATE RESOURCE (WITH LOCK)
  const submit = async (data) => {
    const now = Date.now();

    // 🔒 1. UI LOCK
    if (saving) return;

    // 🔒 2. REF LOCK (instant)
    if (now - lastSubmitRef.current < COOLDOWN) {
      alert("⏳ Please wait before updating again");
      return;
    }

    // 🔒 3. LOCALSTORAGE LOCK
    const existingLock = localStorage.getItem(LOCK_KEY);
    if (existingLock && now - Number(existingLock) < COOLDOWN) {
      alert("🚫 Too many requests. Please wait...");
      return;
    }

    // ✅ SET LOCKS
    lastSubmitRef.current = now;
    localStorage.setItem(LOCK_KEY, now.toString());
    setSaving(true);

    try {
      await databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        id,
        {
          title: data.title,
          description: data.description,
          link: data.link,
        }
      );

      // 🧹 CLEAR CACHE (BETTER)
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith(`edit-${id}`) ||
          key.startsWith(`resources-${type}`) ||
          key.startsWith(`my-resources-${type}`)
        ) {
          localStorage.removeItem(key);
        }
      });

      navigate(`/resources/${type}`);

    } catch (error) {
      console.log("Update error:", error);
      alert("Update failed");
    } finally {
      setSaving(false);

      // 🔓 AUTO UNLOCK
      setTimeout(() => {
        localStorage.removeItem(LOCK_KEY);
      }, COOLDOWN);
    }
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-white">
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl font-semibold">Edit {type}</h2>

        <input
          placeholder="Title"
          {...register("title", { required: true })}
          className="w-full p-3 bg-transparent border border-white/20 rounded"
        />

        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full p-3 bg-transparent border border-white/20 rounded"
        />

        <input
          placeholder="Link"
          {...register("link", { required: true })}
          className="w-full p-3 bg-transparent border border-white/20 rounded"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-500 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditResource;