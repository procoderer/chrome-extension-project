import React, { useState } from "react";

interface Props {
  skills: string[];
  onAdd:    (skill: string) => void | Promise<void>;
  onRemove: (skill: string) => void | Promise<void>;
}

export default function ExtraSkillManager({ skills, onAdd, onRemove }: Props) {
  const [value, setValue] = useState("");

  const add = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
  };

  return (
    <section className="skills">
      <label className="label">Your Skills</label>

      <div className="chips">
        {skills.map((s) => (
          <span key={s} className="chip">
            {s}
            <button
              className="chip-btn"
              aria-label={`Remove ${s}`}
              onClick={() => onRemove(s)}
            >
              ×
            </button>
          </span>
        ))}

        <input
          className="skill-input"
          placeholder="Add skill…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button className="chip-add-btn" onClick={add} aria-label="Add skill">
          +
        </button>
      </div>
    </section>
  );
}
