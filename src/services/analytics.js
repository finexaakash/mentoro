import { ID } from "appwrite";
import { account, databases } from "../lib/appwrite";
import conf from "../conf/conf";

const EVENT_TYPES = new Set(["profile_view", "resource_open"]);

export async function trackAnalytics({ eventType, teacherId, resourceId = "", resourceType = "" }) {
  if (!conf.appwriteAnalyticsCollectionId || !EVENT_TYPES.has(eventType) || !teacherId) return false;

  try {
    // A teacher viewing their own public profile/resources must not increase
    // their dashboard numbers. Guests and other logged-in users are counted.
    const viewer = await account.get().catch(() => null);
    if (viewer?.$id === teacherId) return false;

    await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteAnalyticsCollectionId,
      ID.unique(),
      { eventType, teacherId, resourceId, resourceType }
    );
    return true;
  } catch (error) {
    // Analytics must never prevent a student from opening a resource.
    console.warn("Analytics event was not saved", error);
    return false;
  }
}

export async function trackProfileViewOnce(teacherId) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `profile-view-${teacherId}-${day}`;
  if (localStorage.getItem(key)) return;
  const saved = await trackAnalytics({ eventType: "profile_view", teacherId, resourceId: "profile", resourceType: "profile" });
  if (saved) localStorage.setItem(key, "1");
}

export function trackResourceOpen(resource) {
  trackAnalytics({
    eventType: "resource_open",
    teacherId: resource.userId,
    resourceId: resource.$id,
    resourceType: resource.type || "other",
  });
}
