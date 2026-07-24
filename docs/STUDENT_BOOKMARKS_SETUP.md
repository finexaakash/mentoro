# Student accounts and bookmarks setup

## Student login

Students use these routes:

- `/student/signup` to create a student account
- `/student/login` to sign in

Student accounts are marked with the Appwrite account preference `role: student`. They see their name, **Bookmarks**, and **Logout** in the header; they do not see the teacher dashboard or teacher profile links.

## Create the bookmarks collection in Appwrite

1. Open **Databases** in Appwrite and select your Mentoro database.
2. Create a collection named `bookmarks`.
3. Enable **Document security**.
4. In collection permissions, add the **Users** role twice:

   - **Read**
   - **Create**

   Do not add collection-level **Update** or **Delete**. The application gives the creator update/delete permissions on their own bookmark document.
5. Add these attributes:

| Attribute | Type | Size | Required |
| --- | --- | --- | --- |
| `studentId` | String | 100 | Yes |
| `resourceId` | String | 100 | Yes |
| `resourceType` | String | 30 | Yes |
| `title` | String | 255 | Yes |
| `description` | String | 5000 | No |
| `link` | String | 2000 | Yes |
| `teacherId` | String | 100 | No |

6. Create these indexes after the attributes are ready:

   - `studentId`
   - `studentId, resourceId`
   - `studentId, $createdAt`

7. Copy the collection ID and set it in `.env`:

```env
VITE_APPWRITE_BOOKMARKS_COLLECTION_ID="your_bookmarks_collection_id"
```

8. Restart the Vite development server after editing `.env`.

The Bookmarks page uses Appwrite's List Documents request, which requires collection-level Read permission for authenticated users. The app always queries bookmarks using the current student's `studentId`; bookmark data stores only resource metadata that students can already view publicly.
