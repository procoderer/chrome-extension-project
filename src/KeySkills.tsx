import { useEffect, useState } from "react";
import { extractSkills } from "./skills";
import { getUserSkills } from "./userSkills";

interface Props {
  jobDescription: string;
  refreshKey?: string;   // changes when the user edits custom skills
}

export default function KeySkills({ jobDescription, refreshKey }: Props) {
  const [allSkills,  setAllSkills]  = useState<string[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [showExtras, setShowExtras] = useState(false);

  /* detect skills whenever the JD or custom skills change */
  useEffect(() => {
    extractSkills(jobDescription).then(setAllSkills);
  }, [jobDescription, refreshKey]);

  /* load the user's custom skills so we can separate them */
  useEffect(() => {
    getUserSkills().then(setUserSkills);
  }, [refreshKey]);

  const userSet      = new Set(userSkills);
  const pickedSkills = allSkills.filter(s => userSet.has(s));
  const extraSkills  = allSkills.filter(s => !userSet.has(s));

  return (
    <section className="detected-skills">
      <label className="label">
        Key Skills Detected{allSkills.length ? ` (${allSkills.length})` : ""}
      </label>

      {allSkills.length === 0 ? (
        <p className="subtle">No skills found.</p>
      ) : (
        <>
          {/* always‑visible chips (skills the user explicitly added) */}
          {pickedSkills.length > 0 && (
            <div className="chips picked">
              {pickedSkills.map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          )}

          {/* toggle + hidden chips */}
          {extraSkills.length > 0 && (
            <>
              <button
                type="button"
                className="toggle-link"
                onClick={() => setShowExtras(prev => !prev)}
              >
                {showExtras
                  ? "Hide detected skills"
                  : `Show ${extraSkills.length} extra skill${
                      extraSkills.length > 1 ? "s" : ""
                    }`}
              </button>

              {showExtras && (
                <div className="chips auto">
                  {extraSkills.map(s => (
                    <span key={s} className="chip auto">{s}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
