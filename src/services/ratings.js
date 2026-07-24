import { ID, Permission, Query, Role } from "appwrite";
import conf from "../conf/conf";
import { account, databases } from "../lib/appwrite";

const collectionId = () => conf.appwriteRatingsCollectionId;

const requireCollection = () => {
  if (!collectionId()) throw new Error("Ratings are not configured yet. Add VITE_APPWRITE_RATINGS_COLLECTION_ID to .env.");
};

export const getRatingSummary = async (resourceId, studentId) => {
  requireCollection();
  const result = await databases.listDocuments(
    conf.appwriteDatabaseId,
    collectionId(),
    [Query.equal("resourceId", resourceId), Query.limit(100)]
  );
  const ratings = result.documents.map((rating) => Number(rating.rating) || 0);
  const count = ratings.length;
  const average = count ? ratings.reduce((total, rating) => total + rating, 0) / count : 0;
  const mine = studentId
    ? result.documents.find((rating) => rating.studentId === studentId)?.rating || 0
    : 0;
  return { average, count, mine: Number(mine) || 0 };
};

export const saveRating = async (resourceId, value) => {
  requireCollection();
  if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error("Choose between 1 and 5 stars.");

  const user = await account.get();
  if (user.prefs?.role !== "student") throw new Error("Only students can rate resources.");

  const existing = await databases.listDocuments(
    conf.appwriteDatabaseId,
    collectionId(),
    [Query.equal("resourceId", resourceId), Query.equal("studentId", user.$id), Query.limit(1)]
  );
  const data = { resourceId, studentId: user.$id, rating: value };

  if (existing.documents[0]) {
    await databases.updateDocument(conf.appwriteDatabaseId, collectionId(), existing.documents[0].$id, data);
  } else {
    await databases.createDocument(
      conf.appwriteDatabaseId,
      collectionId(),
      ID.unique(),
      data,
      [
        Permission.read(Role.users()),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );
  }

  return getRatingSummary(resourceId, user.$id);
};
