// import { useEffect, useState } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         // 🔥 1. Fetch all resources by type
//         const res = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteResourcesCollectionId,
//           [Query.equal("type", type)]
//         );

//         setData(res.documents);

//         // 🔥 2. Fetch all teachers
//         const teacherRes = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId
//         );

//         // 🔥 3. Convert to map (userId → teacher)
//         const teacherMap = {};
//         teacherRes.documents.forEach((t) => {
//           teacherMap[t.userId] = t;
//         });

//         setTeachers(teacherMap);

//       } catch (err) {
//         console.log("❌ Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [type]);

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-10">

//       {/* 🔥 HEADER */}
//       <div className="max-w-6xl mx-auto mb-10">
//         <h1 className="text-3xl font-bold capitalize">
//           {type} 📚
//         </h1>
//         <p className="text-gray-400 mt-2 text-sm">
//           Explore all {type} shared by teachers
//         </p>
//       </div>

//       {/* ❌ EMPTY */}
//       {data.length === 0 ? (
//         <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
//           <p className="text-lg">
//             No {type} available yet
//           </p>
//         </div>
//       ) : (

//         /* 🔥 GRID */
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <ResourceCard
//               key={item.$id}
//               item={item}
//               teacher={teachers[item.userId]}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExploreResources;



// import { useEffect, useState } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);

//   const CACHE_KEY = `resources-${type}`;
//   const CACHE_TIME = 5 * 60 * 1000; // 5 min

//   // 🔥 MAIN FETCH FUNCTION
//   const fetchFromAPI = async () => {
//     try {
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [Query.equal("type", type)]
//       );

//       const teacherRes = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteCollectionId
//       );

//       const teacherMap = {};
//       teacherRes.documents.forEach((t) => {
//         teacherMap[t.userId] = t;
//       });

//       // ✅ Update UI
//       setData(res.documents);
//       setTeachers(teacherMap);

//       // ✅ Save cache
//       localStorage.setItem(
//         CACHE_KEY,
//         JSON.stringify({
//           data: res.documents,
//           teachers: teacherMap,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (err) {
//       console.log("❌ Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

//     // 🔥 1. USE CACHE (FAST LOAD)
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setData(cache.data);
//       setTeachers(cache.teachers);
//       setLoading(false);

//       // 🔥 2. BACKGROUND REFRESH (IMPORTANT)
//       fetchFromAPI();
//     } else {
//       // 🔥 3. NO CACHE → FETCH
//       fetchFromAPI();
//     }

//     // 🔥 4. AUTO REFRESH ON TAB FOCUS
//     const handleFocus = () => {
//       localStorage.removeItem(CACHE_KEY);
//       fetchFromAPI();
//     };

//     window.addEventListener("focus", handleFocus);

//     return () => {
//       window.removeEventListener("focus", handleFocus);
//     };

//   }, [type]);

//   // 🔥 MANUAL REFRESH BUTTON
//   const handleRefresh = () => {
//     localStorage.removeItem(CACHE_KEY);
//     setLoading(true);
//     fetchFromAPI();
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-10">

//       {/* 🔥 HEADER */}
//       <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold capitalize">
//             {type} 📚
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm">
//             Explore all {type} shared by teachers
//           </p>
//         </div>

//         {/* 🔥 REFRESH BUTTON */}
//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* ❌ EMPTY */}
//       {data.length === 0 ? (
//         <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
//           <p className="text-lg">
//             No {type} available yet
//           </p>
//         </div>
//       ) : (

//         /* 🔥 GRID */
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <ResourceCard
//               key={item.$id}
//               item={item}
//               teacher={teachers[item.userId]}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExploreResources;



// import { useEffect, useState } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);

//   const CACHE_KEY = `resources-${type}`;
//   const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

//   // 🔥 FETCH FUNCTION (ONLY WHEN NEEDED)
//   const fetchFromAPI = async () => {
//     try {
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [Query.equal("type", type)]
//       );

//       const teacherRes = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteCollectionId
//       );

//       const teacherMap = {};
//       teacherRes.documents.forEach((t) => {
//         teacherMap[t.userId] = t;
//       });

//       // ✅ Update UI
//       setData(res.documents);
//       setTeachers(teacherMap);

//       // ✅ Save cache
//       localStorage.setItem(
//         CACHE_KEY,
//         JSON.stringify({
//           data: res.documents,
//           teachers: teacherMap,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (err) {
//       console.log("❌ Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

//     // ✅ USE CACHE (NO API CALL)
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setData(cache.data);
//       setTeachers(cache.teachers);
//       setLoading(false);
//       return; // 🔥 stops API call
//     }

//     // ✅ ONLY CALL API IF NEEDED
//     fetchFromAPI();

//   }, [type]);

//   // 🔄 MANUAL REFRESH
//   const handleRefresh = () => {
//     localStorage.removeItem(CACHE_KEY);
//     setLoading(true);
//     fetchFromAPI();
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-10">

//       {/* 🔥 HEADER */}
//       <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold capitalize">
//             {type} 📚
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm">
//             Explore all {type} shared by teachers
//           </p>
//         </div>

//         {/* 🔄 REFRESH BUTTON */}
//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* ❌ EMPTY STATE */}
//       {data.length === 0 ? (
//         <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
//           <p className="text-lg">
//             No {type} available yet
//           </p>
//         </div>
//       ) : (

//         /* 🔥 GRID */
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <ResourceCard
//               key={item.$id}
//               item={item}
//               teacher={teachers[item.userId]}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExploreResources;


// import { useEffect, useState } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const LIMIT = 40;
//   const CACHE_TIME = 5 * 60 * 1000;

//   const getCacheKey = (page) => `resources-${type}-page-${page}`;

//   // 🔥 FETCH FUNCTION
//   const fetchFromAPI = async (pageNumber) => {
//     const cacheKey = getCacheKey(pageNumber);
//     const cache = JSON.parse(localStorage.getItem(cacheKey));

//     // ✅ USE CACHE
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setData(cache.data);
//       setTeachers(cache.teachers);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       // 🔥 PAGINATED RESOURCES
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [
//           Query.equal("type", type),
//           Query.limit(LIMIT),
//           Query.offset((pageNumber - 1) * LIMIT),
//           Query.orderDesc("$createdAt"),
//         ]
//       );

//       // 🔥 TEACHERS (can cache separately later if needed)
//       const teacherRes = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteCollectionId
//       );

//       const teacherMap = {};
//       teacherRes.documents.forEach((t) => {
//         teacherMap[t.userId] = t;
//       });

//       setData(res.documents);
//       setTeachers(teacherMap);

//       // ✅ SAVE CACHE
//       localStorage.setItem(
//         cacheKey,
//         JSON.stringify({
//           data: res.documents,
//           teachers: teacherMap,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (err) {
//       console.log("❌ Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 LOAD DATA
//   useEffect(() => {
//     fetchFromAPI(page);
//   }, [page, type]);

//   // 🔄 REFRESH
//   const handleRefresh = () => {
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith(`resources-${type}`)) {
//         localStorage.removeItem(key);
//       }
//     });
//     setPage(1);
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-10">

//       {/* HEADER */}
//       <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold capitalize">
//             {type} 📚
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm">
//             Explore all {type} shared by teachers
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* EMPTY */}
//       {data.length === 0 ? (
//         <div className="flex items-center justify-center mt-20 text-gray-400">
//           No {type} available yet
//         </div>
//       ) : (
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <ResourceCard
//               key={item.$id}
//               item={item}
//               teacher={teachers[item.userId]}
//             />
//           ))}
//         </div>
//       )}

//       {/* 🔥 PAGINATION */}
//       <div className="flex justify-center items-center gap-4 mt-10">

//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className="px-5 py-2 border border-white/20 rounded-lg disabled:opacity-30"
//         >
//           ← Previous
//         </button>

//         <span className="text-gray-400">Page {page}</span>

//         <button
//           onClick={() => setPage((p) => p + 1)}
//           disabled={data.length < LIMIT}
//           className="px-5 py-2 bg-indigo-500 rounded-lg disabled:opacity-30"
//         >
//           Next →
//         </button>

//       </div>
//     </div>
//   );
// };

// export default ExploreResources;


// import { useEffect, useState } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const LIMIT = 40;
//   const CACHE_TIME = 5 * 60 * 1000;

//   const getCacheKey = (page) => `resources-${type}-page-${page}`;
//   const TEACHER_CACHE = "teachers-global";

//   // 🔥 FETCH FUNCTION
//   const fetchFromAPI = async (pageNumber) => {
//     const cacheKey = getCacheKey(pageNumber);
//     const cache = JSON.parse(localStorage.getItem(cacheKey));

//     // ✅ USE CACHE
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setData(cache.data);
//       setTeachers(cache.teachers);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       // 🔥 PAGINATED RESOURCES
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [
//           Query.equal("type", type),
//           Query.limit(LIMIT),
//           Query.offset((pageNumber - 1) * LIMIT),
//           Query.orderDesc("$createdAt"),
//         ]
//       );

//       // 🔥 TEACHERS (GLOBAL CACHE)
//       let teacherMap = {};
//       const teacherCache = JSON.parse(localStorage.getItem(TEACHER_CACHE));

//       if (teacherCache && Date.now() - teacherCache.timestamp < CACHE_TIME) {
//         teacherMap = teacherCache.data;
//       } else {
//         const teacherRes = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId
//         );

//         teacherRes.documents.forEach((t) => {
//           teacherMap[t.userId] = t;
//         });

//         localStorage.setItem(
//           TEACHER_CACHE,
//           JSON.stringify({
//             data: teacherMap,
//             timestamp: Date.now(),
//           })
//         );
//       }

//       setData(res.documents);
//       setTeachers(teacherMap);

//       // ✅ SAVE PAGE CACHE
//       localStorage.setItem(
//         cacheKey,
//         JSON.stringify({
//           data: res.documents,
//           teachers: teacherMap,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (err) {
//       console.log("❌ Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 LOAD DATA
//   useEffect(() => {
//     fetchFromAPI(page);
//   }, [page, type]);

//   // 🔄 REFRESH (FIXED)
//   const handleRefresh = () => {
//     // clear resource cache
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith(`resources-${type}`)) {
//         localStorage.removeItem(key);
//       }
//     });

//     setLoading(true);

//     // 👉 force API call (even if same page)
//     fetchFromAPI(page);
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   // return (
//   //   <div className="min-h-screen text-white px-6 py-10">

//   //     {/* HEADER
//   return (
//   <div className="min-h-screen text-white px-6 py-10">

//     {/* HEADER */}
//     <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//       <div>
//         <h1 className="text-3xl font-bold capitalize">
//           {type} 📚
//         </h1>
//         <p className="text-gray-400 mt-2 text-sm">
//           Explore all {type} shared by teachers
//         </p>
//       </div>

//       {/* 🔥 Glow Button */}
//       <button
//         onClick={handleRefresh}
//         className="
//           relative overflow-hidden
//           bg-indigo-600 hover:bg-indigo-700
//           px-4 py-2 rounded-lg text-sm
//           transition
//         "
//       >
//         <span className="relative z-10">🔄 Refresh</span>

//         <div className="
//           absolute inset-0
//           bg-gradient-to-r from-indigo-500/30 to-purple-500/20
//           opacity-0 hover:opacity-100
//           transition duration-300 blur-lg
//         "></div>
//       </button>
//     </div>

//     {/* EMPTY */}
//     {data.length === 0 ? (
//       <div className="flex items-center justify-center mt-20 text-gray-400">
//         No {type} available yet
//       </div>
//     ) : (
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {data.map((item) => (
          
//           <div
//             key={item.$id}
//             className="
//               relative group
//               rounded-2xl overflow-hidden
//               hover:scale-[1.03] transition
//             "
//           >

//             {/* 🔥 Glow Effect */}
//             <div
//               className="
//                 absolute inset-0
//                 bg-gradient-to-br from-indigo-500/20 to-purple-500/10
//                 opacity-0 group-hover:opacity-100
//                 transition duration-300
//                 blur-xl
//               "
//             ></div>

//             {/* CARD */}
//             <div className="relative z-10">
//               <ResourceCard
//                 item={item}
//                 teacher={teachers[item.userId]}
//               />
//             </div>

//           </div>

//         ))}

//       </div>
//     )}

//     {/* PAGINATION */}
//     <div className="flex justify-center items-center gap-4 mt-10">

//       {/* PREV */}
//       <button
//         onClick={() => setPage((p) => Math.max(1, p - 1))}
//         disabled={page === 1}
//         className="
//           relative overflow-hidden
//           px-5 py-2 border border-white/20 rounded-lg
//           disabled:opacity-30
//         "
//       >
//         <span className="relative z-10">← Previous</span>

//         <div className="
//           absolute inset-0
//           bg-gradient-to-r from-indigo-500/20 to-purple-500/10
//           opacity-0 hover:opacity-100
//           transition blur-lg
//         "></div>
//       </button>

//       <span className="text-gray-400">Page {page}</span>

//       {/* NEXT */}
//       <button
//         onClick={() => setPage((p) => p + 1)}
//         disabled={data.length < LIMIT}
//         className="
//           relative overflow-hidden
//           px-5 py-2 bg-indigo-500 rounded-lg
//           disabled:opacity-30
//         "
//       >
//         <span className="relative z-10">Next →</span>

//         <div className="
//           absolute inset-0
//           bg-gradient-to-r from-indigo-400/30 to-purple-500/20
//           opacity-0 hover:opacity-100
//           transition blur-lg
//         "></div>
//       </button>

//     </div>
//   </div>
// );
// };

// export default ExploreResources;


// import { useEffect, useState, useRef } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const LIMIT = 5;
//   const CACHE_TIME = 5 * 60 * 1000;

//   const debounceRef = useRef(null); // 🔥 debounce control

//   const getCacheKey = (page) => `resources-${type}-page-${page}`;
//   const TEACHER_CACHE = "teachers-global";

//   // 🔥 FETCH FUNCTION
//   const fetchFromAPI = async (pageNumber) => {
//     const cacheKey = getCacheKey(pageNumber);
//     const cache = JSON.parse(localStorage.getItem(cacheKey));

//     // ✅ USE CACHE FIRST
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setData(cache.data);
//       setTeachers(cache.teachers);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       // 📦 FETCH RESOURCES
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [
//           Query.equal("type", type),
//           Query.limit(LIMIT),
//           Query.offset((pageNumber - 1) * LIMIT),
//           Query.orderDesc("$createdAt"),
//         ]
//       );

//       // 👨‍🏫 FETCH TEACHERS (GLOBAL CACHE)
//       let teacherMap = {};
//       const teacherCache = JSON.parse(localStorage.getItem(TEACHER_CACHE));

//       if (teacherCache && Date.now() - teacherCache.timestamp < CACHE_TIME) {
//         teacherMap = teacherCache.data;
//       } else {
//         const teacherRes = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId
//         );

//         teacherRes.documents.forEach((t) => {
//           teacherMap[t.userId] = t;
//         });

//         localStorage.setItem(
//           TEACHER_CACHE,
//           JSON.stringify({
//             data: teacherMap,
//             timestamp: Date.now(),
//           })
//         );
//       }

//       setData(res.documents);
//       setTeachers(teacherMap);

//       // 💾 SAVE PAGE CACHE
//       localStorage.setItem(
//         cacheKey,
//         JSON.stringify({
//           data: res.documents,
//           teachers: teacherMap,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (err) {
//       console.log("❌ Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 DEBOUNCED FETCH
//   useEffect(() => {
//     // clear previous timer
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }

//     // set new timer
//     debounceRef.current = setTimeout(() => {
//       fetchFromAPI(page);
//     }, 400); // ⏱ debounce delay

//     return () => {
//       if (debounceRef.current) {
//         clearTimeout(debounceRef.current);
//       }
//     };
//   }, [page, type]);

//   // 🔄 REFRESH
//   const handleRefresh = () => {
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith(`resources-${type}`)) {
//         localStorage.removeItem(key);
//       }
//     });

//     setLoading(true);
//     fetchFromAPI(page);
//   };

//   // 🔄 LOADING UI
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-10">

//       {/* HEADER */}
//       <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold capitalize">
//             {type} 📚
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm">
//             Explore all {type} shared by teachers
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* EMPTY STATE */}
//       {data.length === 0 ? (
//         <div className="flex items-center justify-center mt-20 text-gray-400">
//           No {type} available yet
//         </div>
//       ) : (
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <div
//               key={item.$id}
//               className="relative group rounded-2xl overflow-hidden hover:scale-[1.03] transition"
//             >
//               <div className="relative z-10">
//                 <ResourceCard
//                   item={item}
//                   teacher={teachers[item.userId]}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* PAGINATION */}
//       <div className="flex justify-center items-center gap-4 mt-10">

//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className="px-5 py-2 border border-white/20 rounded-lg disabled:opacity-30"
//         >
//           ← Previous
//         </button>

//         <span className="text-gray-400">Page {page}</span>

//         <button
//           onClick={() => setPage((p) => p + 1)}
//           disabled={data.length < LIMIT}
//           className="px-5 py-2 bg-indigo-500 rounded-lg disabled:opacity-30"
//         >
//           Next →
//         </button>

//       </div>
//     </div>
//   );
// };

// export default ExploreResources;
// import { useEffect, useState, useRef } from "react";
// import { databases } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";
// import ResourceCard from "../components/ResourceCard";

// const ExploreResources = () => {
//   const { type } = useParams();

//   const [data, setData] = useState([]);
//   const [teachers, setTeachers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [maxPage, setMaxPage] = useState(1);

//   const LIMIT = 5;
//   const CACHE_TIME = 5 * 60 * 1000;

//   const debounceRef = useRef(null);
//   const clickLockRef = useRef(false); // 🔥 fix fast clicks

//   const getCacheKey = (page) => `resources-${type}-page-${page}`;
//   const TEACHER_CACHE = "teachers-global";

//   // 🔥 FETCH FUNCTION
//   const fetchFromAPI = async (pageNumber) => {
//     const cacheKey = getCacheKey(pageNumber);
//     const cache = JSON.parse(localStorage.getItem(cacheKey));

//     // ✅ CACHE FIRST
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setData(cache.data);
//       setTeachers(cache.teachers);

//       if (cache.data.length === LIMIT) {
//         setMaxPage(pageNumber + 1);
//       } else {
//         setMaxPage(pageNumber);
//       }

//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [
//           Query.equal("type", type),
//           Query.limit(LIMIT),
//           Query.offset((pageNumber - 1) * LIMIT),
//           Query.orderDesc("$createdAt"),
//         ]
//       );

//       // 🔥 FIX maxPage
//       if (res.documents.length === LIMIT) {
//         setMaxPage(pageNumber + 1);
//       } else {
//         setMaxPage(pageNumber);
//       }

//       let teacherMap = {};
//       const teacherCache = JSON.parse(localStorage.getItem(TEACHER_CACHE));

//       if (teacherCache && Date.now() - teacherCache.timestamp < CACHE_TIME) {
//         teacherMap = teacherCache.data;
//       } else {
//         const teacherRes = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId
//         );

//         teacherRes.documents.forEach((t) => {
//           teacherMap[t.userId] = t;
//         });

//         localStorage.setItem(
//           TEACHER_CACHE,
//           JSON.stringify({
//             data: teacherMap,
//             timestamp: Date.now(),
//           })
//         );
//       }

//       setData(res.documents);
//       setTeachers(teacherMap);

//       // 💾 CACHE SAVE
//       localStorage.setItem(
//         cacheKey,
//         JSON.stringify({
//           data: res.documents,
//           teachers: teacherMap,
//           timestamp: Date.now(),
//         })
//       );

//     } catch (err) {
//       console.log("❌ Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 DEBOUNCE FETCH
//   useEffect(() => {
//     if (debounceRef.current) {
//       clearTimeout(debounceRef.current);
//     }

//     debounceRef.current = setTimeout(() => {
//       fetchFromAPI(page);
//     }, 400);

//     return () => clearTimeout(debounceRef.current);
//   }, [page, type]);

//   // 🔄 REFRESH
//   const handleRefresh = () => {
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith(`resources-${type}`)) {
//         localStorage.removeItem(key);
//       }
//     });

//     setPage(1);
//     setMaxPage(1);
//     fetchFromAPI(1);
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         <p className="animate-pulse text-lg">
//           Loading {type}...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 py-10">

//       {/* HEADER */}
//       <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold capitalize">
//             {type} 📚
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm">
//             Explore all {type} shared by teachers
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* EMPTY */}
//       {data.length === 0 ? (
//         <div className="flex items-center justify-center mt-20 text-gray-400">
//           No {type} available yet
//         </div>
//       ) : (
//         <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.map((item) => (
//             <div
//               key={item.$id}
//               className="relative group rounded-2xl overflow-hidden hover:scale-[1.03] transition"
//             >
//               <ResourceCard
//                 item={item}
//                 teacher={teachers[item.userId]}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* PAGINATION */}
//       <div className="flex justify-center items-center gap-4 mt-10">

//         {/* PREVIOUS */}
//         <button
//           onClick={() => {
//             if (clickLockRef.current) return;

//             if (!loading) {
//               clickLockRef.current = true;

//               setPage((p) => Math.max(1, p - 1));

//               setTimeout(() => {
//                 clickLockRef.current = false;
//               }, 300);
//             }
//           }}
//           disabled={page === 1}
//           className="px-5 py-2 border border-white/20 rounded-lg disabled:opacity-30"
//         >
//           ← Previous
//         </button>

//         <span className="text-gray-400">Page {page}</span>

//         {/* NEXT */}
//         <button
//           onClick={() => {
//             if (clickLockRef.current) return;

//             if (!loading && page < maxPage) {
//               clickLockRef.current = true;

//               setPage((p) => p + 1);

//               setTimeout(() => {
//                 clickLockRef.current = false;
//               }, 300);
//             }
//           }}
//           disabled={page >= maxPage}
//           className="px-5 py-2 bg-indigo-500 rounded-lg disabled:opacity-30"
//         >
//           Next →
//         </button>

//       </div>
//     </div>
//   );
// };

// export default ExploreResources;



import { useEffect, useState, useRef } from "react";
import { databases } from "../lib/appwrite";
import conf from "../conf/conf";
import { Query } from "appwrite";
import { useParams } from "react-router-dom";
import ResourceCard from "../components/ResourceCard";

const ExploreResources = () => {
  const { type } = useParams();

  const [data, setData] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1); // 🔥 FIX

  const LIMIT = 20;
  const CACHE_TIME = 5 * 60 * 1000;

  const debounceRef = useRef(null);

  const getCacheKey = (page) => `resources-${type}-page-${page}`;
  const TEACHER_CACHE = "teachers-global";

  // 🔥 FETCH FUNCTION
  const fetchFromAPI = async (pageNumber) => {
    const cacheKey = getCacheKey(pageNumber);
    const cache = JSON.parse(localStorage.getItem(cacheKey));

    // ✅ CACHE FIRST
    if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setData(cache.data);
      setTeachers(cache.teachers);

      // 🔥 FIX maxPage from cache
      if (cache.data.length === LIMIT) {
        setMaxPage(pageNumber + 1);
      } else {
        setMaxPage(pageNumber);
      }

      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        [
          Query.equal("type", type),
          Query.limit(LIMIT),
          Query.offset((pageNumber - 1) * LIMIT),
          Query.orderDesc("$createdAt"),
        ]
      );

      // 🔥 FIX maxPage (IMPORTANT)
      if (res.documents.length === LIMIT) {
        setMaxPage(pageNumber + 1);
      } else {
        setMaxPage(pageNumber);
      }

      let teacherMap = {};
      const teacherCache = JSON.parse(localStorage.getItem(TEACHER_CACHE));

      if (teacherCache && Date.now() - teacherCache.timestamp < CACHE_TIME) {
        teacherMap = teacherCache.data;
      } else {
        const teacherRes = await databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId
        );

        teacherRes.documents.forEach((t) => {
          teacherMap[t.userId] = t;
        });

        localStorage.setItem(
          TEACHER_CACHE,
          JSON.stringify({
            data: teacherMap,
            timestamp: Date.now(),
          })
        );
      }

      setData(res.documents);
      setTeachers(teacherMap);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: res.documents,
          teachers: teacherMap,
          timestamp: Date.now(),
        })
      );

    } catch (err) {
      console.log("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DEBOUNCE FETCH (KEEP THIS)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchFromAPI(page);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [page, type]);

  // 🔄 REFRESH
  const handleRefresh = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`resources-${type}`)) {
        localStorage.removeItem(key);
      }
    });

    setPage(1);
    setMaxPage(1);
    fetchFromAPI(1);
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="animate-pulse text-lg">
          Loading {type}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {type} 📚
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Explore all {type} shared by teachers
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* DATA */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center mt-20 text-gray-400">
          No {type} available yet
        </div>
      ) : (
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ResourceCard
              key={item.$id}
              item={item}
              teacher={teachers[item.userId]}
            />
          ))}
        </div>
        
      )}
      

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-10">

        {/* PREVIOUS */}
        <button
          onClick={() => {
            if (!loading) {
              setPage((p) => Math.max(1, p - 1));
            }
          }}
          disabled={loading || page === 1}
          className="px-5 py-2 border border-white/20 rounded-lg disabled:opacity-30"
        >
          ← Previous
        </button>

        <span className="text-gray-400">Page {page}</span>

        {/* NEXT */}
        <button
          onClick={() => {
            if (!loading && page < maxPage) {
              // setPage((p) => p + 1);

              setPage(page + 1);
            }
          }}
          disabled={loading || page >= maxPage}
          className="px-5 py-2 bg-indigo-500 rounded-lg disabled:opacity-30"
        >
          Next →
        </button>

      </div>
    </div>
  );
};

export default ExploreResources;