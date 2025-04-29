import { useEffect, useState } from "react";
import { extractSkills } from "./skills";

interface Props {
  jobDescription: string;
  refreshKey?: string;        // any string that changes when skills change
}

export default function KeySkills({ jobDescription, refreshKey }: Props) {
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    extractSkills(jobDescription).then(setSkills);
  }, [jobDescription, refreshKey]);

  return <p>{skills.length ? skills.join(", ") : "No skills found."}</p>;
}
