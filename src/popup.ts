export {};

const API_KEY = "AIzaSyD0l6qTYCztYeVVTEt3E0cI_5eltSPNVao";
const MODEL_NAME = "gemini-2.0-flash";

// ---- Types for the Gemini REST response ----
interface GeminiPart {
  text?: string;
}
interface GeminiContent {
  parts?: GeminiPart[];
}
interface GeminiCandidate {
  content?: GeminiContent;
}
interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

// ---- Shared fetch helper ----
const callGemini = async (prompt: string): Promise<string> => {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: GeminiResponse = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? `HTTP ${res.status}`);

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response"
  );
};

export const generateCoverLetter = async (description: string): Promise<string> => {
  const prompt =
    `You are a helpful assistant that writes cover letters.\n\n` +
    `Write a professional cover letter based on this job description:\n\n${description}`;
  return callGemini(prompt);
};

export const summarizeJobDescription = async (
  description: string
): Promise<string> => {
  const prompt =
    `You are a helpful assistant that summarizes job descriptions for job seekers.\n\n` +
    `Summarize the following job description in 3-4 sentences:\n\n${description}`;
  return callGemini(prompt);
};

// ---- DOM bindings ----

document.addEventListener("DOMContentLoaded", () => {
  const jobDescInput = document.getElementById(
    "job-description"
  ) as HTMLTextAreaElement | null;
  const generateBtn = document.getElementById(
    "generate-cover-btn"
  ) as HTMLButtonElement | null;
  const outputArea = document.getElementById(
    "cover-letter-output"
  ) as HTMLTextAreaElement | null;

  if (!jobDescInput || !generateBtn || !outputArea) {
    console.warn("Popup elements not found; aborting event wiring.");
    return;
  }

  generateBtn.addEventListener("click", async () => {
    const desc = jobDescInput.value.trim();
    if (!desc) {
      alert("Please enter a job description.");
      return;
    }

    outputArea.value = "Generating…";
    try {
      outputArea.value = await generateCoverLetter(desc);
    } catch (err) {
      console.error("❌ LLM error:", err);
      outputArea.value = `Error: ${(err as Error).message}`;
    }
  });
});
