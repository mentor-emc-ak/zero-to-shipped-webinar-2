// Mock scorer. Real text extraction + AI comparison come later
// (DECISION.md: "AI part will be added later").
const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
  "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Git", "CI/CD",
  "HTML", "CSS", "GraphQL", "Redis", "Kafka", "Terraform",
];

export function scoreSkills(resumeText, jdText) {
  const jdSkills = jdText
    ? SKILLS.filter((s) => jdText.toLowerCase().includes(s.toLowerCase()))
    : SKILLS.slice(0, 10); // no JD provided: score against a default set

  const resumeLower = resumeText.toLowerCase();
  const present = jdSkills.filter((s) => resumeLower.includes(s.toLowerCase()));
  const missing = jdSkills.filter((s) => !present.includes(s));

  const score = jdSkills.length
    ? Math.round((present.length / jdSkills.length) * 100)
    : 0;

  return { score, present, missing };
}
