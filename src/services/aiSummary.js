import { functions } from "../lib/appwrite";
import conf from "../conf/conf";

// Secrets stay in the Appwrite Function; VITE_ variables are public browser values.
export async function createNoteSummary({ title, text }) {
  return runAiStudyTask({ title, text, task: "summary" });
}

export async function createNoteMcqs({ title, text, count = 5 }) {
  return runAiStudyTask({ title, text, task: "mcq", count });
}

async function runAiStudyTask({ title, text, task, count }) {
  if (!conf.appwriteSummaryFunctionId) throw new Error("AI summaries are not configured yet.");
  const execution = await functions.createExecution(
    conf.appwriteSummaryFunctionId,
    JSON.stringify({ title, text, task, count }),
    false
  );
  let result;
  try { result = JSON.parse(execution.responseBody); }
  catch { throw new Error("The summary service returned an invalid response."); }
  if (execution.responseStatusCode >= 400 || result.error) {
    throw new Error(result.error || "Could not create the summary.");
  }
  return task === "mcq" ? result.mcqs : result.summary;
}
