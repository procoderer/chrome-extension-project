import { useState, useEffect } from "react";
import ExtraSkillManager from "./ExtraSkillManager";
import {
  getUserSkills,
  addUserSkill,
  removeUserSkill,
} from "./userSkills";
import KeySkills from "./KeySkills";
import "./App.css";
import useGeminiApiKey from "./useGeminiApiKey";

/* ---------- Gemini helpers ---------- */
const MODEL_NAME = "gemini-2.0-flash";

async function generateCoverLetter(apiKey: string, description: string): Promise<string> {
  const url  = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
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

async function summarizeJobDescription(apiKey: string, description: string): Promise<string> {
  const url  = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
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
  const { apiKey, saveKey } = useGeminiApiKey();

  useEffect(() => {
    // Initial pull of job description
    chrome.runtime.sendMessage({ type: "GET_JOB_DESCRIPTION" }, res => {
      if (res?.text) setJobDesc(res.text);
    });
  
    // Live updates
    const listener = (msg: any) => {
      if (msg.type === "JOB_DESCRIPTION_UPDATED" && msg.payload?.text) {
        setJobDesc(msg.payload.text);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  /* Load saved skills on mount */
  useEffect(() => { getUserSkills().then(setUserSkills); }, []);

  /* Handlers ------------------------------------------------------ */
  const handleAddSkill    = async (s: string) => setUserSkills(await addUserSkill(s));
  const handleRemoveSkill = async (s: string) => setUserSkills(await removeUserSkill(s));

  const handleGenerate = async () => {
    if (!apiKey) return alert("Enter your gemini-2.0-flash API key first!");
    if (!jobDesc.trim()) return alert("Paste a job description first!");
    setLoading(true);  setLetter("");
    try   { setLetter(await generateCoverLetter(apiKey, jobDesc)); }
    catch (e: any) { setLetter("Error: " + e.message); }
    finally { setLoading(false); }
  };

  const handleSummarize = async () => {
    if (!apiKey) return alert("Enter your gemini-2.0-flash API key first!");
    if (!jobDesc.trim()) return alert("Paste a job description first!");
    setSummarizing(true); setSummary("");
    try   { setSummary(await summarizeJobDescription(apiKey, jobDesc)); }
    catch (e: any) { setSummary("Error: " + e.message); }
    finally { setSummarizing(false); }
  };

  /* Render -------------------------------------------------------- */
  return (
    <main className="container">
      <h1 className="title">JobAppAI</h1>

      <label htmlFor="key" className="label">gemini-2.0-flash&nbsp;API&nbsp;Key</label>
      <input
        id="key"
        type="password"
        className="input"
        placeholder="Paste your gemini-2.0-flash API key here…"
        value={apiKey}
        onChange={e => saveKey(e.target.value.trim())}
      />

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
        rows={6}
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
        rows={6}
        value={summary}
        placeholder="Job description summary will appear here…"
      />

      {/* Letter */}
      <label className="label">Cover Letter</label>
      <textarea
        className="textarea output"
        readOnly
        rows={6}
        value={letter}
        placeholder="Your cover letter will appear here…"
      />

      <footer className="footer">Built with ❤️ </footer>
    </main>
  );
}
