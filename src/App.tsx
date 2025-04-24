import React, { useState, useEffect } from "react";
import "./App.css";
import Hello from "./frontend/components/Hello";
import { extractSkills } from "./frontend/utils/skills";

function App() {
  return (
    <div className="App">
      <h1>Starter Extension</h1>
      {/* Render the SnippetList component with the snippets and event handlers */}
      <Hello person="World" />
      <KeySkills 
        jobDescription="testing" 
        extraSkillsToLookFor={["testing"]} 
      />
    </div>
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

export default App;
