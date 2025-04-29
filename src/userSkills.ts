const STORE_KEY = "extraSkills";

const normalize = (s: string) => s.trim().toLowerCase();
const storage = chrome?.storage?.local;

export async function getUserSkills(): Promise<string[]> {
  if (storage) {
    return new Promise(res =>
      storage.get(STORE_KEY, d => res((d[STORE_KEY] || []) as string[]))
    ).then((arr: unknown) => (arr as string[]).map(normalize));
  }

  const raw = localStorage.getItem(STORE_KEY);
  return raw ? JSON.parse(raw).map(normalize) : [];
}

export async function saveUserSkills(skills: string[]): Promise<void> {
  const clean = Array.from(new Set(skills.map(normalize)));
  if (storage) {
    return new Promise(res => storage.set({ [STORE_KEY]: clean }, res));
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(clean));
}

export async function addUserSkill(skill: string): Promise<string[]> {
  const skills = await getUserSkills();
  if (!skills.includes(normalize(skill))) {
    skills.push(normalize(skill));
    await saveUserSkills(skills);
  }
  return skills;
}

export async function removeUserSkill(skill: string): Promise<string[]> {
  const skills = (await getUserSkills()).filter(s => s !== normalize(skill));
  await saveUserSkills(skills);
  return skills;
}
