import React, { useState, useEffect } from "react";
import "./App.css";
import { extractSkills } from "./skills";

const API_KEY    = "AIzaSyD0l6qTYCztYeVVTEt3E0cI_5eltSPNVao";
const MODEL_NAME = "gemini-2.0-flash";

async function generateCoverLetter(description: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text:
              "You are a helpful assistant that writes cover letters.\n\n" +
              `Write a professional cover letter based on this job description:\n\n${description}`,
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text
    ?? "No response"
  );
}

function KeySkills({ jobDescription, extraSkillsToLookFor }: { jobDescription: string, extraSkillsToLookFor?: string[] }) {
  const [skills, setSkills] = useState<string[] | null>(null);

  useEffect(() => {
    async function fetchSkills() {
      const result = await extractSkills(jobDescription, extraSkillsToLookFor);
      setSkills(result);
    }
    fetchSkills();
  }, [jobDescription, extraSkillsToLookFor]);

  return <p>{skills ? skills.join(", ") : "No Skills Found"}</p>;
}

export default function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [letter, setLetter]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDesc.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setLoading(true);
    setLetter("Generating…");
    try {
      const result = await generateCoverLetter(jobDesc);
      setLetter(result);
    } catch (err: any) {
      setLetter("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: 16, fontFamily: "sans-serif" }}>
      <KeySkills 
        jobDescription="testing" 
        extraSkillsToLookFor={["testing"]} 
      />

      <h1>Cover Letter Generator</h1>

      <textarea
        style={{ width: "100%", height: 120, marginBottom: 8 }}
        placeholder="Paste job description…"
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
      />

      <button
        style={{ padding: "8px 16px", marginBottom: 8 }}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating…" : "Generate Cover Letter"}
      </button>

      <textarea
        style={{ width: "100%", height: 200 }}
        readOnly
        value={letter}
        placeholder="Your cover letter will appear here…"
      />
    </div>
  );
}
