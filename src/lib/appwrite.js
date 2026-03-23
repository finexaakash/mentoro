import { Client, Account, Databases,Storage } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
    console.log("PROJECT ID:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
console.log("URL:", import.meta.env.VITE_APPWRITE_URL);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);   // ✅ added
export { client, account, databases, storage };