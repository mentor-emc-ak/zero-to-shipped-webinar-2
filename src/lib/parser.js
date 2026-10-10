/* Mock parsing logic — framework-agnostic, so it stays plain JS.
   Nothing leaves the browser: the file is read locally. */

export const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
  "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Git", "CI/CD",
  "HTML", "CSS", "GraphQL", "Redis", "Terraform", "Linux",
];

// Simple PDF text extraction: pull text out of uncompressed content streams
// and even out of compressed streams where the string literals survive.
export function extractPdfText(arrayBuffer) {
  let raw = "";
  try {
    raw = new TextDecoder("latin1").decode(arrayBuffer);
  } catch {
    return "";
  }
  const matches = raw.match(/\((?:\\.|[^\\()])*\)/g);
  if (!matches) return "";
  return matches
    .map((m) => m.slice(1, -1).replace(/\\([()\\])/g, "$1"))
    .join(" ");
}

// Small, deterministic hash so the same resume always gets the same score.
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function computeResult(fileName, text) {
  const haystack = text.toLowerCase();
  const present = [];
  const missing = [];

  for (const skill of SKILLS) {
    // Word-boundary-ish match so "java" doesn't match "javascript"
    const pattern = new RegExp(
      `\\b${skill.toLowerCase().replace(/[.+]/g, "\\$&")}\\b`
    );
    if (pattern.test(haystack)) present.push(skill);
    else missing.push(skill);
  }

  const detected = present.length;
  const score = Math.min(95, 15 + detected * 6);
  const verdict =
    score >= 70 ? "Strong match 🎯"
    : score >= 40 ? "Decent base — add the missing skills"
    : "Needs work — most target skills are absent";

  return { fileName, score, present, missing, verdict };
}

export function validateFile(file) {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "That doesn't look like a PDF. Please choose a .pdf file.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "File is larger than ~5 MB. Please choose a smaller PDF.";
  }
  return null;
}
