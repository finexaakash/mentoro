

// import { useEffect, useState } from "react";
// import { databases, storage } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";

// const TeacherProfile = () => {
//   const { userId } = useParams();

//   const [resources, setResources] = useState([]);
//   const [teacher, setTeacher] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         // 🔥 Teacher Profile
//         const profileRes = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteCollectionId,
//           [Query.equal("userId", userId)]
//         );

//         if (profileRes.documents.length > 0) {
//           setTeacher(profileRes.documents[0]);
//         }

//         // 🔥 Resources
//         const res = await databases.listDocuments(
//           conf.appwriteDatabaseId,
//           conf.appwriteResourcesCollectionId,
//           [Query.equal("userId", userId)]
//         );

//         setResources(res.documents);

//       } catch (error) {
//         console.log("❌ Fetch Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetch();
//   }, [userId]);

//   // 🔥 Group resources
//   const grouped = {
//     notes: [],
//     books: [],
//     videos: [],
//     links: [],
//   };

//   resources.forEach((r) => {
//     if (grouped[r.type]) {
//       grouped[r.type].push(r);
//     }
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 md:px-12 py-10">

//       {/* 🔥 TEACHER HEADER */}
//       {teacher && (
//         <div className="max-w-5xl mx-auto mb-12 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">

//           {/* Avatar */}
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/30"></div>

//             <img
//               src={
//                 teacher.imageId
//                   ? storage
//                       .getFileView(conf.appwriteBucketId, teacher.imageId)
//                       .toString()
//                   : "https://via.placeholder.com/150"
//               }
//               className="relative w-28 h-28 rounded-full object-cover border border-white/10"
//             />
//           </div>

//           {/* Info */}
//           <div>
//             <h1 className="text-2xl font-bold">{teacher.name}</h1>

//             <p className="text-indigo-400">
//               {teacher.designation}
//             </p>

//             <p className="text-gray-400 mt-2 max-w-md">
//               {teacher.about}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* 🔥 RESOURCE SECTIONS */}
//       {["notes", "books", "videos", "links"].map((type) => (
//         <div key={type} className="mb-12 max-w-6xl mx-auto">

//           {/* Title */}
//           <h2 className="text-xl font-semibold mb-6 capitalize text-white/90">
//             {type} 📚
//           </h2>

//           {/* Empty */}
//           {grouped[type].length === 0 ? (
//             <p className="text-gray-500">No {type} available</p>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//               {grouped[type].map((item) => (
//                 <div
//                   key={item.$id}
//                   className="
//                     group p-5 rounded-2xl
//                     bg-gradient-to-br from-white/5 to-white/0
//                     border border-white/10
//                     hover:border-indigo-400/40
//                     hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]
//                     transition duration-300
//                   "
//                 >
//                   {/* Title */}
//                   <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition">
//                     {item.title}
//                   </h3>

//                   {/* Description */}
//                   <p className="text-sm text-gray-400 mt-2 line-clamp-3">
//                     {item.description}
//                   </p>

//                   {/* 🔥 BUTTON */}
//                   <div className="mt-6">
//                     <a
//                       href={item.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="
//                         inline-flex items-center justify-center
//                         w-full px-4 py-2 text-sm font-medium
//                         rounded-lg
//                         bg-indigo-500/20 text-indigo-400
//                         hover:bg-indigo-500/30
//                         transition
//                       "
//                     >
//                       Open Resource →
//                     </a>
//                   </div>
//                 </div>
//               ))}

//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TeacherProfile;


// import { useEffect, useState } from "react";
// import { databases, storage } from "../lib/appwrite";
// import conf from "../conf/conf";
// import { Query } from "appwrite";
// import { useParams } from "react-router-dom";

// const TeacherProfile = () => {
//   const { userId } = useParams();

//   const [resources, setResources] = useState([]);
//   const [teacher, setTeacher] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const CACHE_KEY = `teacher-${userId}`;
//   const CACHE_TIME = 5 * 60 * 1000; // 5 min

//   // 🔥 FETCH FUNCTION
//   const fetchData = async () => {
//     try {
//       // Teacher
//       const profileRes = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteCollectionId,
//         [Query.equal("userId", userId)]
//       );

//       const teacherData = profileRes.documents[0] || null;

//       // Resources
//       const res = await databases.listDocuments(
//         conf.appwriteDatabaseId,
//         conf.appwriteResourcesCollectionId,
//         [Query.equal("userId", userId)]
//       );

//       const resourcesData = res.documents;

//       // ✅ Update state
//       setTeacher(teacherData);
//       setResources(resourcesData);

//       // ✅ Save cache
//       localStorage.setItem(
//         CACHE_KEY,
//         JSON.stringify({
//           teacher: teacherData,
//           resources: resourcesData,
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

//     // ✅ USE CACHE (NO API)
//     if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
//       setTeacher(cache.teacher);
//       setResources(cache.resources);
//       setLoading(false);
//       return;
//     }

//     // ✅ FETCH ONLY IF NEEDED
//     fetchData();

//   }, [userId]);

//   // 🔄 MANUAL REFRESH
//   const handleRefresh = () => {
//     localStorage.removeItem(CACHE_KEY);
//     setLoading(true);
//     fetchData();
//   };

//   // 🔥 GROUPING
//   const grouped = {
//     notes: [],
//     books: [],
//     videos: [],
//     links: [],
//   };

//   resources.forEach((r) => {
//     if (grouped[r.type]) {
//       grouped[r.type].push(r);
//     }
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen text-white px-6 md:px-12 py-10">

//       {/* HEADER + REFRESH */}
//       <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
//         <h1 className="text-xl text-gray-300">Teacher Profile</h1>

//         <button
//           onClick={handleRefresh}
//           className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* TEACHER HEADER */}
//       {teacher && (
//         <div className="max-w-5xl mx-auto mb-12 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
//           <img
//             src={
//               teacher.imageId
//                 ? storage
//                     .getFileView(conf.appwriteBucketId, teacher.imageId)
//                     .toString()
//                 : "https://via.placeholder.com/150"
//             }
//             className="w-28 h-28 rounded-full object-cover"
//           />

//           <div>
//             <h1 className="text-2xl font-bold">{teacher.name}</h1>
//             <p className="text-indigo-400">{teacher.designation}</p>
//             <p className="text-gray-400 mt-2 max-w-md">
//               {teacher.about}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* RESOURCES */}
//       {["notes", "books", "videos", "links"].map((type) => (
//         <div key={type} className="mb-12 max-w-6xl mx-auto">

//           <h2 className="text-xl font-semibold mb-6 capitalize">
//             {type} 📚
//           </h2>

//           {grouped[type].length === 0 ? (
//             <p className="text-gray-500">No {type} available</p>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {grouped[type].map((item) => (
//                 <div key={item.$id} className="p-5 rounded-2xl border border-white/10">
//                   <h3 className="font-semibold text-lg">{item.title}</h3>
//                   <p className="text-sm text-gray-400 mt-2">
//                     {item.description}
//                   </p>

//                   <a
//                     href={item.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block mt-4 text-indigo-400"
//                   >
//                     Open →
//                   </a>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TeacherProfile;


import { useEffect, useState } from "react";
import { databases, storage } from "../lib/appwrite";
import conf from "../conf/conf";
import { Query } from "appwrite";
import { useParams } from "react-router-dom";

const TYPES = ["notes", "books", "videos", "links"];

const TeacherProfile = () => {
  const { userId } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [resources, setResources] = useState({
    notes: [],
    books: [],
    videos: [],
    links: [],
  });

  const [pages, setPages] = useState({
    notes: 1,
    books: 1,
    videos: 1,
    links: 1,
  });

  const [loading, setLoading] = useState(true);

  const LIMIT = 10;
  const CACHE_TIME = 5 * 60 * 1000;

  const getCacheKey = (type, page) =>
    `teacher-${userId}-${type}-page-${page}`;

  // 🔥 FETCH TEACHER
  const fetchTeacher = async () => {
    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", userId)]
      );

      setTeacher(res.documents[0] || null);
    } catch (err) {
      console.log("Teacher fetch error:", err);
    }
  };

  // 🔥 FETCH RESOURCES (WITH FORCE OPTION)
  const fetchResources = async (type, page, force = false) => {
    const cacheKey = getCacheKey(type, page);
    const cache = JSON.parse(localStorage.getItem(cacheKey));

    // ✅ USE CACHE (only if NOT force)
    if (!force && cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setResources((prev) => ({ ...prev, [type]: cache.data }));
      return;
    }

    try {
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        [
          Query.equal("userId", userId),
          Query.equal("type", type),
          Query.limit(LIMIT),
          Query.offset((page - 1) * LIMIT),
          Query.orderDesc("$createdAt"),
        ]
      );

      setResources((prev) => ({ ...prev, [type]: res.documents }));

      // ✅ SAVE CACHE
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: res.documents,
          timestamp: Date.now(),
        })
      );

    } catch (err) {
      console.log("Resource fetch error:", err);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await fetchTeacher();

      await Promise.all(
        TYPES.map((type) => fetchResources(type, pages[type]))
      );

      setLoading(false);
    };

    load();
  }, [userId]);

  // 🔄 PAGE CHANGE
  const changePage = (type, direction) => {
    setPages((prev) => {
      const newPage =
        direction === "next"
          ? prev[type] + 1
          : Math.max(1, prev[type] - 1);

      fetchResources(type, newPage);

      return { ...prev, [type]: newPage };
    });
  };

  // 🔄 REFRESH (FIXED)
  const handleRefresh = async () => {
    setLoading(true);

    // 🧹 CLEAR CACHE
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`teacher-${userId}`)) {
        localStorage.removeItem(key);
      }
    });

    // 🔥 FORCE FETCH
    await Promise.all(
      TYPES.map((type) =>
        fetchResources(type, pages[type], true)
      )
    );

    setLoading(false);
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
    <div className="min-h-screen text-white px-6 md:px-12 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-xl text-gray-300">Teacher Profile</h1>

        <button
          onClick={handleRefresh}
          className="bg-indigo-600 px-4 py-2 rounded-lg text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* TEACHER INFO */}
      {teacher && (
        <div className="max-w-5xl mx-auto mb-12 bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-6 items-center">
          <img
            src={
              teacher.imageId
                ? storage
                    .getFileView(conf.appwriteBucketId, teacher.imageId)
                    .toString()
                : "https://via.placeholder.com/150"
            }
            className="w-28 h-28 rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold">{teacher.name}</h1>
            <p className="text-indigo-400">{teacher.designation}</p>
            <p className="text-gray-400 mt-2">{teacher.about}</p>
          </div>
        </div>
      )}

      {/* SECTIONS */}
      {TYPES.map((type) => (
        <div key={type} className="mb-12 max-w-6xl mx-auto">

          <h2 className="text-xl font-semibold mb-6 capitalize">
            {type} 📚
          </h2>

          {resources[type].length === 0 ? (
            <p className="text-gray-500">No {type} available</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources[type].map((item) => (

<div
              key={item.$id}
              className="
                relative group
                bg-white/5 p-5 rounded-2xl
                border border-white/10
                overflow-hidden
                hover:scale-[1.03] hover:shadow-2xl
                transition duration-300
              "
            >

              {/* 🔥 Glow */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-br from-indigo-500/20 to-purple-500/10
                  opacity-0 group-hover:opacity-100
                  transition duration-300
                  blur-xl pointer-events-none
                "
              ></div>
                    
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {item.description}
                    </p>

                    
                    <a
  href={item.link}
  target="_blank"
  rel="noopener noreferrer"
  className="
    inline-block mt-4 w-20 text-center
    bg-indigo-500 hover:bg-indigo-600
    text-white text-sm font-medium
    py-2 rounded-lg
    transition duration-200
  "
>
  Open →
</a>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-4 mt-6">
                {/* <button
                  onClick={() => changePage(type, "prev")}
                  disabled={pages[type] === 1}
                  className="px-4 py-2 border border-white/20 rounded disabled:opacity-30"
                >
                  ← Prev
                </button> */}
                <button
  onClick={() => changePage(type, "prev")}
  disabled={pages[type] === 1}
  className={`
    px-4 py-2 rounded font-medium
    transition-all duration-300

    ${
      pages[type] === 1
        ? "border border-white/20 opacity-30 cursor-not-allowed"
        : "border border-white/20 hover:border-indigo-400 hover:text-indigo-300 hover:-translate-y-[1px] "
    }
  `}
>
  ← Prev
</button>

                <span>Page {pages[type]}</span>

                {/* <button
                  onClick={() => changePage(type, "next")}
                  disabled={resources[type].length < LIMIT}
                  className="px-4 py-2 bg-indigo-500 rounded disabled:opacity-30"
                >
                  Next →
                </button> */}
                <button
  onClick={() => changePage(type, "next")}
  disabled={resources[type].length < LIMIT}
  className={`
    px-4 py-2 rounded font-medium
    transition-all duration-300

    ${
      resources[type].length < LIMIT
        ? "bg-indigo-400 opacity-30 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-[1px] "
    }
  `}
>
  Next →
</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherProfile;