import React, { useState } from "react";

interface Props {
  skills: string[];
  onAdd(skill: string): void | Promise<void>;
  onRemove(skill: string): void | Promise<void>;
}

export default function ExtraSkillManager({ skills, onAdd, onRemove }: Props) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>Your custom skills:</strong>{" "}
      {skills.map(s => (
        <span key={s} style={{ marginRight: 6 }}>
          {s}{" "}
          <button onClick={() => onRemove(s)} style={{ cursor: "pointer" }}>
            ✕
          </button>
        </span>
      ))}

      <div style={{ marginTop: 6 }}>
        <input
          value={input}
          placeholder="Add skill…"
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
