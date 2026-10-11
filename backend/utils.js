export function verdictFor(score) {
  return score >= 70 ? "Strong match 🎯"
    : score >= 40 ? "Decent base — add the missing skills"
    : "Needs work — most target skills are absent";
}
