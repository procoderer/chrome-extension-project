import { useEffect, useState } from "react";
import { extractSkills } from "./skills";

interface Props {
  jobDescription: string;
  refreshKey?: string;   // changes when the user edits custom skills
}

export default function KeySkills({ jobDescription, refreshKey }: Props) {
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    extractSkills(jobDescription).then(setSkills);
  }, [jobDescription, refreshKey]);

  return (
    <section className="detected-skills">
      <label className="label">
        Key Skills Detected{skills.length ? ` (${skills.length})` : ""}
      </label>

      {skills.length === 0 ? (
        <p className="subtle">No skills found.</p>
      ) : (
        <div className="chips auto">
          {skills.map((s) => (
            <span key={s} className="chip auto">
              {s}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
