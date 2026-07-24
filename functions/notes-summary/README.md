# Mentoro AI notes summary function (Groq)

Deploy this folder as an Appwrite Function using a Node.js 18+ runtime with entry point `src/main.js`.

Create `GROQ_API_KEY` as a **Function secret/environment variable**. Never put it in React's `.env` file. Let authenticated users execute the function, then add its Function ID to the website `.env`:

```env
VITE_APPWRITE_SUMMARY_FUNCTION_ID="your-function-id"
```

In Appwrite, add a non-required `notesText` string attribute (size at least `12000`) to the `resources` collection. Teachers paste the relevant study text when publishing. The AI summarizes that text; it does not access a private Google Drive file.
