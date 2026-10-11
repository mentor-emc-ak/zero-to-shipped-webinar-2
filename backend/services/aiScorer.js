import { askLabd } from "./aiClient.js";
import { normaliseSkills } from "../utils.js";

// Builds the scoring prompt, calls labd AI, and validates what comes back so
// one malformed reply can't break the response the frontend renders.
export async function scoreWithAI(resumeText, jdText) {
  const content = [
    "You are a technical recruiter scoring a resume against a job description.",
    "",
    "RESUME:",
    resumeText,
    "",
    "JOB DESCRIPTION:",
    jdText || "(no job description provided — judge general marketability)",
    "",
    "Reply with ONLY a JSON object, no markdown, no explanation:",
    '{"score": <integer 0-100>, "present": [<skill names found in the resume that match the JD>], "missing": [<skills the JD wants that the resume lacks>]}',
    'Rules: "present" and "missing" are arrays of short skill strings (max 15 each). If no JD, judge against a typical full-stack role. Score reflects overall match quality.',
  ].join("\n");

  const reply = await askLabd(content);
  const parsed = JSON.parse(reply);
  const score = Number(parsed.score);
  const present = normaliseSkills(parsed.present);
  const missing = normaliseSkills(parsed.missing);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error("AI returned an invalid score");
  }

  return { score: Math.round(score), present, missing, engine: "ai" };
}

export default { scoreWithAI };
