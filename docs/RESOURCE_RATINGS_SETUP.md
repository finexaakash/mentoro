# Resource ratings setup

## 1. Create the Appwrite collection

Create a collection named `ratings` in the Mentoro database.

Enable **Document security**. In the collection **Permissions**, give the **Users** role:

- Read
- Create

Do not give collection-level Update or Delete permissions. The application gives the student who creates a rating permission to change or delete only their own rating.

## 2. Add attributes

| Attribute | Type | Size / limits | Required |
| --- | --- | --- | --- |
| `resourceId` | String | 100 | Yes |
| `studentId` | String | 100 | Yes |
| `rating` | Integer | Minimum 1, maximum 5 | Yes |

## 3. Add indexes

Create both indexes using the **Key** index type:

1. `resourceId_index`: `resourceId` ascending
2. `resource_student_index`: `resourceId` ascending, `studentId` ascending

## 4. Add the collection ID

Copy the collection ID to `.env`:

```env
VITE_APPWRITE_RATINGS_COLLECTION_ID="your_ratings_collection_id"
```

Restart `npm run dev`. Students can then select 1–5 stars; changing a selection updates their existing rating instead of creating another one.
