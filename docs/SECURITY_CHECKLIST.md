# Mentoro security checklist

This project now avoids logging Appwrite configuration in the browser, validates outgoing resource links as `https://` or `http://`, and creates new resource documents with owner-only update/delete permissions.

## Required Appwrite configuration

These settings are essential because a React route guard is only a user-interface guard; Appwrite permissions are the actual access control.

### Resources collection

1. Enable **Document security**.
2. At collection level, allow **Users** to **Create** only if teachers create resources directly from the browser.
3. Do **not** grant collection-level Update or Delete to Users.
4. New resource documents created by the app grant:
   - Read: authenticated Users
   - Update/Delete: the teacher who created the document

Existing resource rows do not automatically receive these document permissions. Re-save or migrate them before removing broad collection update/delete permissions.

### Profile collection

1. Enable **Document security**.
2. Avoid collection-level Update/Delete for Users.
3. Each teacher profile document should grant Update/Delete only to that teacher.
4. Give only the minimum Read access required to display public teacher profiles.

### Bookmarks and ratings

Follow [STUDENT_BOOKMARKS_SETUP.md](./STUDENT_BOOKMARKS_SETUP.md) and [RESOURCE_RATINGS_SETUP.md](./RESOURCE_RATINGS_SETUP.md). Do not grant collection-level Update/Delete to Users.

### Appwrite Function and secrets

- Keep `GROQ_API_KEY` only in the Appwrite Function secrets; never put it in a `VITE_` variable.
- Restrict function execution to authenticated users.
- Add your real deployed domain and `http://localhost:5173` (development only) as Appwrite Web platforms.

### Production recommendation

Roles stored in Account Preferences improve the UI but are editable by the account owner. For strict teacher-only publishing, move resource creation, edit, and delete operations to an Appwrite Function that verifies the teacher profile on the server before it writes data.
