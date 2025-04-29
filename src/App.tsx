import React, { useState, useEffect } from "react";
import "./App.css";
import ExtraSkillManager from "./ExtraSkillManager";
import {
  getUserSkills,
  addUserSkill,
  removeUserSkill,
} from "./userSkills";
import KeySkills from "./KeySkills";

// Use the correct environment variable for Vite
const API_KEY    = import.meta.env.VITE_GEMINI_API_KEY as string;
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

async function summarizeJobDescription(description: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [
      {
        parts: [
          {
            text:
              "You are a helpful assistant that summarizes job descriptions for job seekers.\n\n" +
              `Summarize the following job description in 3-4 sentences:\n\n${description}`,
          },
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary available";
}

export default function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [letter, setLetter]   = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);

  useEffect(() => { getUserSkills().then(setUserSkills); }, []);
  const handleAddSkill = async (skill: string) =>
    setUserSkills(await addUserSkill(skill));
  const handleRemoveSkill = async (skill: string) =>
    setUserSkills(await removeUserSkill(skill));

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

  const handleSummarize = async () => {
    if (!jobDesc.trim()) {
      alert("Please enter a job description.");
      return;
    }
    setSummarizing(true);
    setSummary("Summarizing…");
    try {
      const result = await summarizeJobDescription(jobDesc);
      setSummary(result);
    } catch (err: any) {
      setSummary("Error: " + err.message);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="App" style={{ padding: 16, fontFamily: "sans-serif" }}>
      <ExtraSkillManager
        skills={userSkills}
        onAdd={handleAddSkill}
        onRemove={handleRemoveSkill}
      />

      <KeySkills jobDescription="testing c deez nuts briuh " refreshKey={userSkills.join(",")} />
      
      <h1>Cover Letter Generator</h1>

      <textarea
        style={{ width: "100%", height: 120, marginBottom: 8 }}
        placeholder="Paste job description…"
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
      />

      <button
        style={{ padding: "8px 16px", marginBottom: 8, marginRight: 8 }}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating…" : "Generate Cover Letter"}
      </button>

      <button
        style={{ padding: "8px 16px", marginBottom: 8 }}
        onClick={handleSummarize}
        disabled={summarizing}
      >
        {summarizing ? "Summarizing…" : "Summarize Job Description"}
      </button>

      <textarea
        style={{ width: "100%", height: 80, marginBottom: 8 }}
        readOnly
        value={summary}
        placeholder="Job description summary will appear here…"
      />

      <textarea
        style={{ width: "100%", height: 200 }}
        readOnly
        value={letter}
        placeholder="Your cover letter will appear here…"
      />
    </div>
  );
}
