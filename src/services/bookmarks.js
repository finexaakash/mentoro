import { ID, Permission, Query, Role } from "appwrite";
import conf from "../conf/conf";
import { account, databases } from "../lib/appwrite";

const getCollectionId = () => conf.appwriteBookmarksCollectionId;

const requireBookmarkCollection = () => {
  if (!getCollectionId()) {
    throw new Error("Bookmarks are not configured yet. Add VITE_APPWRITE_BOOKMARKS_COLLECTION_ID to your .env file.");
  }
};

const currentStudent = async () => {
  const user = await account.get();
  if (user.prefs?.role !== "student") throw new Error("Bookmarks are available for student accounts only.");
  return user;
};

export const getBookmark = async (resourceId) => {
  requireBookmarkCollection();
  const user = await currentStudent();
  const result = await databases.listDocuments(
    conf.appwriteDatabaseId,
    getCollectionId(),
    [Query.equal("studentId", user.$id), Query.equal("resourceId", resourceId), Query.limit(1)]
  );
  return result.documents[0] || null;
};

export const toggleBookmark = async (resource) => {
  requireBookmarkCollection();
  const existing = await getBookmark(resource.$id);

  if (existing) {
    await databases.deleteDocument(conf.appwriteDatabaseId, getCollectionId(), existing.$id);
    return false;
  }

  const user = await currentStudent();
  await databases.createDocument(
    conf.appwriteDatabaseId,
    getCollectionId(),
    ID.unique(),
    {
      studentId: user.$id,
      resourceId: resource.$id,
      resourceType: resource.type || "links",
      title: resource.title || "Untitled resource",
      description: resource.description || "",
      link: resource.link || "",
      teacherId: resource.userId || "",
    },
    [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ]
  );
  return true;
};

export const listBookmarks = async () => {
  requireBookmarkCollection();
  const user = await currentStudent();
  const result = await databases.listDocuments(
    conf.appwriteDatabaseId,
    getCollectionId(),
    [Query.equal("studentId", user.$id), Query.orderDesc("$createdAt"), Query.limit(100)]
  );
  return result.documents;
};
