export function verdictFor(score) {
  return score >= 70 ? "Strong match 🎯"
    : score >= 40 ? "Decent base — add the missing skills"
    : "Needs work — most target skills are absent";
}

// Cleans AI-returned skill arrays: keeps strings only, trims, drops empties,
// caps length so one odd reply can't blow up the frontend chips.
export function normaliseSkills(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((s) => typeof s === "string" && s.trim())
    .map((s) => s.trim())
    .slice(0, 15);
}
