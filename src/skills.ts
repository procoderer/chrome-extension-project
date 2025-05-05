import { getUserSkills } from "./userSkills";

let cachedSkills: string[] | null = null;

/**
 * Lazily reads public/data/skills.csv, normalises the list and
 * expands entries of the form "Full Skill Name (ABC)" into
 * ["full skill name", "abc"].
 */
async function loadSkills(): Promise<string[]> {
  if (cachedSkills) return cachedSkills;

  const url = chrome.runtime.getURL("data/skills.csv");
  const raw = await fetch(url).then(r => r.text());

  cachedSkills = [
    ...new Set(
      raw
        .split(/\r?\n/)                        // 1 line → 1 entry
        .flatMap(line => {
          const trimmed = line.trim();
          if (!trimmed) return [];            // skip blanks

          // ── "Something (XYZ)"  ➜  ["something", "xyz"] ───────────
          const match = trimmed.match(/^(.+?)\s+\(([^)]+)\)$/);
          if (match) {
            const [_, full, acronym] = match;
            return [full.toLowerCase(), acronym.toLowerCase()];
          }

          return [trimmed.toLowerCase()];
        })
        .map(s => s.toLowerCase())
        .filter(Boolean)
    )
  ];

  return cachedSkills;
}

/**
 * extractSkills
 * -------------
 * Scans a job‑description string and returns the set of skills that appear.
 *
 * @param jobDescription – raw text of the vacancy
 * @param extraSkills    – optional extra skills (not in the CSV) to look for
 * @returns Promise<string[]>  skills in first‑seen order
 */
export async function extractSkills(jobDescription: string): Promise<string[]> {
  const [csvSkills, userSkills] = await Promise.all([
    loadSkills(),
    getUserSkills()
  ]);
  const SKILLS = [...csvSkills, ...userSkills];

  // Pre‑process the description
  const description = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]+/g, " ");

  const escapeRE = (s: string) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const allowed = "a-z0-9+#\\.";               // chars we allow *inside* a skill
  const boundary = `[^${allowed}]`;            // any char *outside* a skill

  const skillsPattern = SKILLS.map(escapeRE).join("|");

  //  (^|boundary)  (skill1|skill2|...)  (?=$|boundary)
  const skillRegex = new RegExp(
    `(?:^|${boundary})(${skillsPattern})(?=$|${boundary})`,
    "gi"
  );

  const found = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = skillRegex.exec(description)) !== null) {
    const hit = match[1];
    if (!found.has(hit)) found.add(hit);
  }

  const userSet = new Set(userSkills);              // put the user’s skills first
  return [
    ...userSkills.filter(s => found.has(s)),
    ...Array.from(found).filter(s => !userSet.has(s))
  ];
}
