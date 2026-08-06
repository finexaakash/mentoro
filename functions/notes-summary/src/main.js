/* global process */
// Appwrite Function entry point (Node.js 18+). Store GROQ_API_KEY as a secret.
export default async ({ req, res, error }) => {
  if (req.method !== "POST") return res.json({ error: "Method not allowed" }, 405);
  let body;
  try { body = JSON.parse(req.body || "{}"); }
  catch { return res.json({ error: "Invalid JSON body" }, 400); }

  const title = String(body.title || "Untitled resource").slice(0, 200);
  const text = String(body.text || "").trim();
  const task = body.task === "mcq" ? "mcq" : "summary";
  const count = Math.min(Math.max(Number(body.count) || 5, 3), 10);
  if (!text) return res.json({ error: "There is no study text to use." }, 400);
  if (!process.env.GROQ_API_KEY) return res.json({ error: "GROQ_API_KEY is not configured in Appwrite." }, 500);

  const systemPrompt = task === "mcq"
    ? `Create exactly ${count} accurate multiple-choice practice questions for a student. Return ONLY valid JSON, with no markdown or code fence, in this shape: {"mcqs":[{"question":"...","options":["option A","option B","option C","option D"],"answer":"A","explanation":"short reason"}]}. Use only the supplied note text. Each question must have exactly four options and one correct answer.`
    : "Create an accurate, student-friendly study summary using point-wise bullet lists. Do not use Markdown headings, # symbols, asterisks, or numbered headings. Start each point with the bullet character •. Group points under plain-text labels such as Key ideas, Important terms, and Revision questions, followed by bullet points. Include 3 revision questions. Only use supplied text; say when information is missing.";

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Resource title: ${title}\n\nStudy text:\n${text.slice(0, 12000)}` },
        ],
        temperature: task === "mcq" ? 0.2 : 0.3,
        max_tokens: task === "mcq" ? 1600 : 900,
      }),
    });
    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      error(data.error?.message || "Groq request failed");
      return res.json({ error: "The Groq AI service is temporarily unavailable." }, 502);
    }
    const output = data.choices?.[0]?.message?.content?.trim();
    if (!output) return res.json({ error: "Groq did not return a result." }, 502);

    if (task === "mcq") {
      try {
        const mcqs = JSON.parse(output.replace(/^```json\s*|\s*```$/g, "")).mcqs;
        if (!Array.isArray(mcqs)) throw new Error("Missing MCQs");
        return res.json({ mcqs });
      } catch {
        error("Groq returned invalid MCQ JSON");
        return res.json({ error: "The AI returned invalid MCQs. Please generate again." }, 502);
      }
    }
    return res.json({ summary: output });
  } catch (err) {
    error(err.message);
    return res.json({ error: "Could not complete the AI study task." }, 500);
  }
};
