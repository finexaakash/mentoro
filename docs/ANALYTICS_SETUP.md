# Mentoro teacher analytics setup

The application writes one event when a public teacher profile is viewed (at most once per browser per day) and one event whenever a resource is opened. The teacher dashboard counts only documents whose read permission belongs to that teacher.

## 1. Add profile visibility

In the existing `profile` collection, create this attribute:

| Attribute | Type | Required | Default |
| --- | --- | --- | --- |
| `isPublic` | Boolean | No | `true` |

This powers the **Show my profile to students** checkbox in the teacher's profile form.

## 2. Create an analytics collection

Create a collection called `analytics`. Add these string attributes:

| Attribute | Size | Required |
| --- | --- | --- |
| `eventType` | 30 | Yes |
| `teacherId` | 100 | Yes |
| `resourceId` | 100 | Yes |
| `resourceType` | 30 | Yes |

In the collection's **Settings > Permissions**, set:

- **Create**: `Any` — lets guests/students create an event without signing in.
- **Read**: `Users` — only logged-in users, including teachers, can read events. Do not use `Any` for Read.

Do not set per-document permissions for analytics. An anonymous browser cannot grant a teacher read permission to its newly-created document; the collection-level `Users` read permission lets the logged-in teacher dashboard query the totals instead.

Add these indexes so the dashboard queries stay fast:

- key index: `teacherId`, `eventType`
- key index: `teacherId`, `eventType`, `resourceType`
- key index: `teacherId`, `$createdAt`

## 3. Configure the frontend

Copy the analytics collection ID into the local `.env` file:

```env
VITE_APPWRITE_ANALYTICS_COLLECTION_ID="your-analytics-collection-id"
```

Restart the Vite development server after editing `.env`.

## Privacy note

This feature counts visits and opens; it does not store a student's name, email, or IP address. It is basic product analytics, not fraud-proof analytics—an untrusted browser can still submit artificial events. Use an Appwrite Function with server-side validation later if you need strict reporting.
