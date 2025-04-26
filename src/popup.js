// popup.js

const API_KEY    = "AIzaSyD0l6qTYCztYeVVTEt3E0cI_5eltSPNVao";
const MODEL_NAME = "gemini-2.0-flash";

async function generateCoverLetter(description) {
  // 1) Hit the v1beta generateContent endpoint for Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;  // :contentReference[oaicite:0]{index=0}

  // 2) Wrap your entire prompt in the "contents" array, using the parts/text format
  const body = {
    contents: [
      {
        parts: [
          {
            text: `You are a helpful assistant that writes cover letters.\n\n` +
                  `Write a professional cover letter based on this job description:\n\n${description}`
          }
        ]
      }
    ]
  };  // :contentReference[oaicite:1]{index=1}

  const res  = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);

  // 3) Pull the generated text out of the first candidate's content.parts[0].text
  return data.candidates?.[0]?.content?.parts?.[0]?.text
      ?? "No response";
}

document.addEventListener("DOMContentLoaded", () => {
  const jobDescInput = document.getElementById("job-description");
  const generateBtn  = document.getElementById("generate-cover-btn");
  const outputArea   = document.getElementById("cover-letter-output");

  generateBtn.addEventListener("click", async () => {
    const desc = jobDescInput.value.trim();
    if (!desc) return alert("Please enter a job description.");

    outputArea.value = "Generating…";
    try {
      const letter = await generateCoverLetter(desc);
      outputArea.value = letter;
    } catch (err) {
      console.error("❌ LLM error:", err);
      outputArea.value = `Error: ${err.message}`;
    }
  });
});
