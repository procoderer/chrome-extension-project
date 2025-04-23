let cachedSkills: string[] | null = null;

/**
 * Lazily reads public/data/skills.csv, splits by line,
 * trims & lower‑cases each entry, filters empties.
 */
async function loadSkills(): Promise<string[]> {
  if (cachedSkills) return cachedSkills;

  // In a Chrome extension we need the *absolute* URL for fetch.
  const url = chrome.runtime.getURL("data/skills.csv");
  const raw = await fetch(url).then(r => r.text());

  cachedSkills = raw
    .split(/\r?\n/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  return cachedSkills;
}

/**
 * extractSkills
 * -------------
 * Scans a job‑description string and returns the set of skills that appear.
 *
 * @param jobDescription – raw text of the vacancy
 * @param extraSkills    – optional extra skills (not in the CSV) to look for
 * @returns Promise<string[]>  skills in first‑seen order
 */
export async function extractSkills(
    jobDescription: string,
    extraSkills: string[] = []
  ): Promise<string[]> {
  const SKILLS = [
    ...(await loadSkills()),
    ...extraSkills.map(s => s.toLowerCase())
  ];

  // Pre‑process the description
  const description = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]+/g, " ");

  // Build one big regex: \b(skill1|skill2|c\+\+|next\.js)\b
  const skillRegex = new RegExp(
    `\\b(${SKILLS.map(s => s.replace(/[.+]/g, "\\$&")).join("|")})\\b`,
    "g"
  );

  const found = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = skillRegex.exec(description)) !== null) {
    const hit = match[1];
    if (!found.has(hit)) found.add(hit);
  }

  return Array.from(found);
}
