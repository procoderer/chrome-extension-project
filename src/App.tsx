import React, { useState, useEffect } from "react";
import ExtraSkillManager from "./ExtraSkillManager";
import {
  getUserSkills,
  addUserSkill,
  removeUserSkill,
} from "./userSkills";
import KeySkills from "./KeySkills";
import "./App.css";

/* ---------- Gemini helpers ---------- */
const API_KEY    = import.meta.env.VITE_GEMINI_API_KEY as string;
const MODEL_NAME = "gemini-2.0-flash";

async function generateCoverLetter(description: string): Promise<string> {
  const url  = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
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
  const res  = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
}

async function summarizeJobDescription(description: string): Promise<string> {
  const url  = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
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
  const res  = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary available";
}

/* ---------- Small UI helpers ---------- */
const Spinner = () => <span className="spinner" aria-hidden="true" />;

/* ---------- Main component ---------- */
export default function App() {
  const [jobDesc,     setJobDesc]     = useState("");
  const [letter,      setLetter]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [summary,     setSummary]     = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [userSkills,  setUserSkills]  = useState<string[]>([]);

  /* Pull the job description once (from your background script) */
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_JOB_DESCRIPTION" }, res => {
      if (res?.text) setJobDesc(res.text);
    });
  }, []);

  /* Load saved skills on mount */
  useEffect(() => { getUserSkills().then(setUserSkills); }, []);

  /* Handlers ------------------------------------------------------ */
  const handleAddSkill    = async (s: string) => setUserSkills(await addUserSkill(s));
  const handleRemoveSkill = async (s: string) => setUserSkills(await removeUserSkill(s));

  const handleGenerate = async () => {
    if (!jobDesc.trim()) return alert("Paste a job description first!");
    setLoading(true);  setLetter("");
    try   { setLetter(await generateCoverLetter(jobDesc)); }
    catch (e: any) { setLetter("Error: " + e.message); }
    finally { setLoading(false); }
  };

  const handleSummarize = async () => {
    if (!jobDesc.trim()) return alert("Paste a job description first!");
    setSummarizing(true); setSummary("");
    try   { setSummary(await summarizeJobDescription(jobDesc)); }
    catch (e: any) { setSummary("Error: " + e.message); }
    finally { setSummarizing(false); }
  };

  /* Render -------------------------------------------------------- */
  return (
    <main className="container">
      <h1 className="title">JobAppAI</h1>

      <ExtraSkillManager
        skills={userSkills}
        onAdd={handleAddSkill}
        onRemove={handleRemoveSkill}
      />

      <KeySkills jobDescription={jobDesc} refreshKey={userSkills.join(",")} />

      {/* Job description input */}
      <label htmlFor="jd" className="label">Job Description</label>
      <textarea
        id="jd"
        className="textarea"
        rows={4}
        placeholder="Paste job description…"
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
      />

      {/* Action buttons */}
      <div className="actions">
        <button className="btn primary" onClick={handleGenerate} disabled={loading}>
          {loading && <Spinner />}Generate Cover Letter
        </button>
        <button className="btn outline" onClick={handleSummarize} disabled={summarizing}>
          {summarizing && <Spinner />}Summarize Job Description
        </button>
      </div>

      {/* Summary */}
      <label className="label">Summary</label>
      <textarea
        className="textarea output"
        readOnly
        rows={4}
        value={summary}
        placeholder="Job description summary will appear here…"
      />

      {/* Letter */}
      <label className="label">Cover Letter</label>
      <textarea
        className="textarea output"
        readOnly
        rows={4}
        value={letter}
        placeholder="Your cover letter will appear here…"
      />

      <footer className="footer">Built with ❤️ </footer>
    </main>
  );
}
