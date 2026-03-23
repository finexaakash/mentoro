

// import { useEffect, useState } from "react";
// import { databases, storage } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { useNavigate } from "react-router-dom";

// const Teachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getTeachers = async () => {
//       try {
//         const res = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId
//         );

//         setTeachers(res.documents);
//       } catch (error) {
//         console.log("❌ Fetch Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getTeachers();
//   }, []);

//   // 🔄 Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center  text-white">
//         <p className="animate-pulse text-lg">Loading teachers...</p>
//       </div>
//     );
//   }

//   // ❌ Empty
//   if (teachers.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-gray-400">
//         No teachers found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen  text-white px-6 py-12">

//       {/* 🔥 Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-3xl font-bold">Explore Teachers 👨‍🏫</h1>
//         <p className="text-gray-400 mt-2">
//           Learn from top contributors and faculty
//         </p>
//       </div>

//       {/* 🔥 Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {teachers.map((t) => {
//           const imageUrl = t.imageId
//             ? storage
//                 .getFileView(conf.appwriteBucketId, t.imageId)
//                 .toString()
//             : "https://via.placeholder.com/300";

//           return (
//             <div
//               key={t.$id}
//               onClick={() => navigate(`/teacher/${t.userId}`)}
//               className="
//                 group cursor-pointer rounded-2xl overflow-hidden
//                 bg-white/5 backdrop-blur border border-white/10
//                 hover:scale-[1.04] hover:shadow-2xl
//                 transition duration-300
//               "
//             >
//               {/* 🔥 Image */}
//               <div className="relative">
//                 <img
//                   src={imageUrl}
//                   alt="teacher"
//                   className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
//                 />

//                 {/* gradient overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//               </div>

//               {/* 🔥 Content */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold">{t.name}</h2>

//                 <p className="text-sm text-indigo-400">
//                   {t.designation}
//                 </p>

//                 <p className="text-sm text-gray-400 mt-2 line-clamp-2">
//                   {t.about}
//                 </p>

//                 {/* subtle CTA */}
//                 <div className="mt-3 text-xs text-white group-hover:text-indigo-400 transition">
//                   View Profile →
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Teachers;

// without improved data

// import { useEffect, useState } from "react";
// import { databases, storage } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { useNavigate } from "react-router-dom";

// const Teachers = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const CACHE_KEY = "teachers-cache";
//   const CACHE_TIME = 5 * 60 * 1000; // 5 min

//   // 🔥 FETCH FUNCTION
//   const fetchTeachers = async () => {
//     try {
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteCollectionId
//       );

//       setTeachers(res.documents);

//       // ✅ SAVE CACHE
//       localStorage.setItem(
//         CACHE_KEY,
//         JSON.stringify({
//           data: res.documents,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (error) {
//       console.log("❌ Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

//     // ✅ USE CACHE (NO API CALL)
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setTeachers(cache.data);
//       setLoading(false);
//       return;
//     }

//     // ✅ FETCH ONLY IF NEEDED
//     fetchTeachers();

//   }, []);

//   // 🔄 MANUAL REFRESH
//   const handleRefresh = () => {
//     localStorage.removeItem(CACHE_KEY);
//     setLoading(true);
//     fetchTeachers();
//   };

//   // 🔄 Loading
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">Loading teachers...</p>
//       </div>
//     );
//   }

//   // ❌ Empty
//   if (teachers.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-400">
//         No teachers found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-12">

//       {/* 🔥 Header */}
//       <div className="text-center mb-10 flex justify-between items-center max-w-7xl mx-auto">
//         <div>
//           <h1 className="text-3xl font-bold">Explore Teachers 👨‍🏫</h1>
//           <p className="text-gray-400 mt-2">
//             Learn from top contributors and faculty
//           </p>
//         </div>

//         {/* 🔄 Refresh Button */}
//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* 🔥 Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {teachers.map((t) => {
//           const imageUrl = t.imageId
//             ? storage
//                 .getFileView(conf.appwriteBucketId, t.imageId)
//                 .toString()
//             : "https://via.placeholder.com/300";

//           return (
//             <div
//               key={t.$id}
//               onClick={() => navigate(`/teacher/${t.userId}`)}
//               className="
//                 group cursor-pointer rounded-2xl overflow-hidden
//                 bg-white/5 backdrop-blur border border-white/10
//                 hover:scale-[1.04] hover:shadow-2xl
//                 transition duration-300
//               "
//             >
//               {/* Image */}
//               <div className="relative">
//                 <img
//                   src={imageUrl}
//                   alt="teacher"
//                   loading="lazy"
//                   className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//               </div>

//               {/* Content */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold">{t.name}</h2>

//                 <p className="text-sm text-indigo-400">
//                   {t.designation}
//                 </p>

//                 <p className="text-sm text-gray-400 mt-2 line-clamp-2">
//                   {t.about}
//                 </p>

//                 <div className="mt-3 text-xs text-white group-hover:text-indigo-400 transition">
//                   View Profile →
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Teachers;


import { useEffect, useState } from "react";
import { databases, storage } from "../lib/appwrite";
import conf from "../conf/conf";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const LIMIT = 20;
  const CACHE_TIME = 5 * 60 * 1000;

  const getCacheKey = (page) => `teachers-page-${page}`;

  // 🔥 FETCH TEACHERS WITH PAGINATION
  const fetchTeachers = async (pageNumber) => {
    const cacheKey = getCacheKey(pageNumber);
    const cache = JSON.parse(localStorage.getItem(cacheKey));

    // ✅ USE CACHE
    if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setTeachers(cache.data);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [
          Query.limit(LIMIT),
          Query.offset((pageNumber - 1) * LIMIT),
          Query.orderDesc("$createdAt"),
        ]
      );

      setTeachers(res.documents);

      // ✅ SAVE CACHE
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: res.documents,
          timestamp: Date.now(),
        })
      );

    } catch (error) {
      console.log("❌ Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOAD DATA
  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

 


  const handleRefresh = () => {
  // 🧹 Clear all cache
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("teachers-page-")) {
      localStorage.removeItem(key);
    }
  });

  setLoading(true);

  // 👉 FORCE API CALL (important)
  fetchTeachers(page);
};

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">Loading teachers...</p>
      </div>
    );
  }

  // ❌ Empty
  if (teachers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No teachers found
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 py-12">

      {/* HEADER */}
      <div className="text-center mb-10 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Explore Teachers 👨‍🏫</h1>
          <p className="text-gray-400 mt-2">
            Learn from top contributors and faculty
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {teachers.map((t) => {
          const imageUrl = t.imageId
            ? storage
                .getFileView(conf.appwriteBucketId, t.imageId)
                .toString()
            : "https://via.placeholder.com/300";

          return (
//             <div
//               key={t.$id}
//               onClick={() => navigate(`/teacher/${t.userId}`)}
//               className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 backdrop-blur border border-white/10 hover:scale-[1.04] hover:shadow-2xl transition duration-300"
//             >
//               <div className="relative">
//                 <img
//                   src={imageUrl}
//                   alt="teacher"
//                   loading="lazy"
//                   className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//               </div>

//               <div className="p-4">
//                 <h2 className="text-lg font-semibold">{t.name}</h2>

//                 <p className="text-sm text-indigo-400">
//                   {t.designation}
//                 </p>

//                 <p className="text-sm text-gray-400 mt-2 line-clamp-2">
//                   {t.about}
//                 </p>

//                 {/* <div className="mt-3 text-xs text-white group-hover:text-indigo-400 transition">
//                   View Profile →
//                 </div> */}
//                 <div
//   className="
//     mt-3 inline-block
//     bg-indigo-500 hover:bg-indigo-600
//     text-white text-xs font-medium
//     px-3 py-1.5 rounded-md
//     transition duration-200
//   "
// >
//   View Profile →
// </div>
//               </div>
            // </div>
            <div
  key={t.$id}
  onClick={() => navigate(`/teacher/${t.userId}`)}
  className="
    relative group cursor-pointer
    rounded-2xl overflow-hidden
    bg-white/5 backdrop-blur border border-white/10

    transition-all duration-300
    hover:scale-[1.04]
    hover:shadow-2xl

    /* 🔥 TIGHT GLOW */
    shadow-[0_0_0px_rgba(99,102,241,0)]
    group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]
    group-hover:border-indigo-400/40
  "
>

  {/* 🔥 INNER GLOW */}
  <div
    className="
      absolute inset-0 rounded-2xl
      opacity-0 group-hover:opacity-100
      transition duration-300
      pointer-events-none
      bg-gradient-to-br from-indigo-500/10 to-purple-500/10
    "
  ></div>

  <div className="relative z-10">

    {/* IMAGE */}
    <div className="relative overflow-hidden">
      <img
        src={imageUrl}
        alt="teacher"
        loading="lazy"
        className="
          w-full h-48 object-cover
          transition duration-300
          group-hover:scale-110
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>

    {/* CONTENT */}
    <div className="p-4">

      <h2 className="text-lg font-semibold">
        {t.name}
      </h2>

      <p className="text-sm text-indigo-400">
        {t.designation}
      </p>

      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
        {t.about}
      </p>

      {/* BUTTON */}
      <div
        className="
          mt-3 inline-block
          px-3 py-1.5 rounded-md text-xs font-medium
          bg-indigo-500 text-white
          transition-all duration-300

          group-hover:bg-indigo-600
          group-hover:-translate-y-[1px]
          
        "
      >
        View Profile →
      </div>

    </div>
  </div>
</div>
          );
        })}
      </div>

      {/* 🔥 PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-10">

        {/* <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-5 py-2 border border-white/20 rounded-lg disabled:opacity-30"
        >
          ← Previous
        </button> */}
        <button
  onClick={() => setPage((p) => Math.max(1, p - 1))}
  disabled={page === 1}
  className={`
    px-5 py-2 rounded-lg font-medium
    transition-all duration-300

    ${
      page === 1
        ? "border border-white/20 opacity-30 cursor-not-allowed"
        : "border border-white/20 hover:border-indigo-400 hover:text-indigo-300 hover:-translate-y-[1px] "
    }
  `}
>
  ← Previous
</button>

        <span className="text-gray-400">Page {page}</span>

       
        <button
  onClick={() => setPage((p) => p + 1)}
  disabled={teachers.length < LIMIT}
  className={`
    px-5 py-2 rounded-lg font-medium
    transition-all duration-300

    ${
      teachers.length < LIMIT
        ? "bg-indigo-400 opacity-30 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-[1px] "
    }
  `}
>
  Next →
</button>

      </div>
    </div>
  );
};

export default Teachers;