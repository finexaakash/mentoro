const conf = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,

  appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,

  appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  appwriteResourcesCollectionId:import.meta.env.VITE_APPWRITE_RESOURCES_COLLECTION_ID,
  appwriteSummaryFunctionId: import.meta.env.VITE_APPWRITE_SUMMARY_FUNCTION_ID,
  appwriteAnalyticsCollectionId: import.meta.env.VITE_APPWRITE_ANALYTICS_COLLECTION_ID,
  appwriteBookmarksCollectionId: import.meta.env.VITE_APPWRITE_BOOKMARKS_COLLECTION_ID,
  appwriteRatingsCollectionId: import.meta.env.VITE_APPWRITE_RATINGS_COLLECTION_ID,

};

export default conf;
