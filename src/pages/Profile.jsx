


import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { databases, storage, account } from "../lib/appwrite";
import conf from "../conf/conf";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { register, handleSubmit, reset } = useForm();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    notes: 0,
    books: 0,
    videos: 0,
    links: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // 🔒 REQUEST LOCK
  const submitLockRef = useRef(0);
  const COOLDOWN = 5000;

  const CACHE_KEY = "profile-cache";
  const AUTH_KEY = "auth-cache";
  const CACHE_TIME = 5 * 60 * 1000;

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      let user;

      const authCache = JSON.parse(localStorage.getItem(AUTH_KEY));

      if (authCache && Date.now() - authCache.timestamp < CACHE_TIME) {
        user = authCache.user;
      } else {
        user = await account.get();
        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({ user, timestamp: Date.now() })
        );
      }

      // PROFILE
      const profileRes = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", user.$id)]
      );

      let profileData = null;
      if (profileRes.documents.length > 0) {
        profileData = profileRes.documents[0];
      }

      // RESOURCES
      const res = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteResourcesCollectionId,
        [Query.equal("userId", user.$id)]
      );

      const count = {
        notes: 0,
        books: 0,
        videos: 0,
        links: 0,
      };

      res.documents.forEach((item) => {
        if (count[item.type] !== undefined) {
          count[item.type]++;
        }
      });

      setProfile(profileData);
      setStats(count);

      // ✅ CACHE SAVE
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          profile: profileData,
          stats: count,
          timestamp: Date.now(),
        })
      );

    } catch (err) {
      console.log("Auth error:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (cache && Date.now() - cache.timestamp < CACHE_TIME) {
      setProfile(cache.profile);
      setStats(cache.stats);
      setLoading(false);
      return;
    }

    fetchData();
  }, []);

  // 🔥 SUBMIT PROFILE (WITH LOCK)
  const submit = async (data) => {
    const now = Date.now();

    // 🔒 UI LOCK
    if (saving) return;

    // 🔒 REF LOCK (instant)
    if (now - submitLockRef.current < COOLDOWN) {
      alert("⏳ Please wait a few seconds before saving again");
      return;
    }

    submitLockRef.current = now;
    setSaving(true);

    try {
      let user;
      const authCache = JSON.parse(localStorage.getItem(AUTH_KEY));

      if (authCache) {
        user = authCache.user;
      } else {
        user = await account.get();
      }

      let imageId = profile?.imageId;

      // Upload image
      if (data.image?.[0]) {
        const file = await storage.createFile(
          conf.appwriteBucketId,
          ID.unique(),
          data.image[0]
        );
        imageId = file.$id;
      }

      let updatedProfile;

      if (profile) {
        updatedProfile = await databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          profile.$id,
          {
            designation: data.designation,
            about: data.about,
            imageId,
          }
        );
      } else {
        updatedProfile = await databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          ID.unique(),
          {
            name: user.name,
            designation: data.designation,
            about: data.about,
            imageId,
            userId: user.$id,
          }
        );
      }

      setProfile(updatedProfile);
      setEditMode(false);
      setPreview(null);
      reset();

      // 🔥 CLEAR CACHE
      localStorage.removeItem(CACHE_KEY);

    } catch (error) {
      console.log("Submit error:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        Loading...
      </div>
    );
  }

  const imageUrl =
    preview ||
    (profile?.imageId
      ? storage
          .getFileView(conf.appwriteBucketId, profile.imageId)
          .toString()
      : "https://via.placeholder.com/150");

  return (
    <div className="min-h-screen text-white">
      {/* HEADER */}
      <div className="w-full px-6 md:px-12 pt-10 pb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your profile and resources
        </p>
      </div>

      <div className="w-full px-6 md:px-12 pb-12">

        {/* PROFILE VIEW */}
        {!editMode && profile && (
          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-6">

              <div className="p-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 w-fit">
                <img
                  src={imageUrl}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="text-indigo-400 text-sm">
                  {profile.designation}
                </p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-indigo-500/20 text-indigo-400 rounded">
                  Teacher
                </span>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="px-5 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                Edit Profile
              </button>
            </div>

            <p className="text-gray-400 mt-6 max-w-3xl">
              {profile.about}
            </p>

            {/* STATS */}
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              
              {[
                { label: "Notes", value: stats.notes },
                { label: "Books", value: stats.books },
                { label: "Videos", value: stats.videos },
                { label: "Links", value: stats.links },
              ].map((item) => (
                
                <div
                  key={item.label}
                  
                    className="
              relative group
              p-6 rounded-xl text-center
              bg-white/5 border border-white/10
              transition duration-300
              hover:scale-105

              shadow-[0_0_0px_rgba(99,102,241,0)]
              group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
              group-hover:border-indigo-400/40
            "
          >

            {/* INNER GLOW */}
            <div
              className="
                absolute inset-0 rounded-xl
                opacity-0 group-hover:opacity-100
                transition duration-300
                pointer-events-none
                bg-gradient-to-br from-indigo-500/10 to-purple-500/10
              "
            ></div>
                
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {item.label}
                  </p>
                </div>
                
              ))}
              
            </div>
          </div>
        )}

        {/* FORM */}
        {(editMode || !profile) && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mt-6 max-w-xl backdrop-blur-xl">
            <form onSubmit={handleSubmit(submit)} className="space-y-5">

              <h2 className="text-xl font-semibold">
                {profile ? "Edit Profile" : "Create Profile"}
              </h2>

              
              <div className="flex items-center gap-4">

  {/* IMAGE */}
  <img
    src={imageUrl}
    className="w-16 h-16 rounded-full object-cover border border-white/20"
  />

  {/* HIDDEN INPUT */}
  <input
  
    type="file"
    accept="image/*"
    className="
      px-4 py-2 rounded-lg cursor-pointer font-medium
      bg-indigo-500 hover:bg-indigo-600
      transition-all duration-300

      hover:-translate-y-[1px]
      
    "
    {...register("image")}
    onChange={(e) =>
      setPreview(URL.createObjectURL(e.target.files[0]))
    }
  />

  {/* CUSTOM BUTTON */}
 

</div>

              <input
                defaultValue={profile?.designation}
                placeholder="Designation"
                {...register("designation", { required: true })}
                className="w-full p-3 rounded-lg bg-transparent border border-white/20"
              />

              <textarea
                defaultValue={profile?.about}
                placeholder="About"
                {...register("about", { required: true })}
                className="w-full p-3 rounded-lg bg-transparent border border-white/20"
              />

              <div className="flex gap-3">
                
                <button
  disabled={saving}
  className={`
    px-5 py-2 rounded-lg font-medium
    transition-all duration-300

    ${
      saving
        ? "bg-indigo-400 opacity-70 cursor-not-allowed"
        : "bg-indigo-500 hover:bg-indigo-600 hover:-translate-y-[1px] "
    }
  `}
>
  {saving ? "Saving..." : "Save"}
</button>

                {profile && (
                  
                  <button
  type="button"
  onClick={() => setEditMode(false)}
  className="
    px-5 py-2 rounded-lg font-medium
    border border-white/20
    transition-all duration-300

    hover:border-indigo-400/40
    hover:text-indigo-300
    hover:-translate-y-[1px]
    
  "
>
  Cancel
</button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;