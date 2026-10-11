// The single place the frontend talks to the backend.
// Same-origin by default: "/api" reaches the backend through the Vite dev
// proxy locally and the Vercel rewrite in production. VITE_API_URL can still
// override for a separately deployed backend.
const API_URL = import.meta.env.VITE_API_URL || "";

function verdictFor(score) {
  return score >= 70 ? "Strong match 🎯"
    : score >= 40 ? "Decent base — add the missing skills"
    : "Needs work — most target skills are absent";
}

export async function scoreResume(file, jd) {
  const form = new FormData();
  form.append("resume", file);
  form.append("jd", jd);

  let res;
  try {
    res = await fetch(`${API_URL}/api/score`, { method: "POST", body: form });
  } catch {
    throw new Error("Can't reach the backend — is it running on port 4000?");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Backend error (${res.status})`);
  }
  const data = await res.json();
  return { ...data, fileName: file.name, verdict: verdictFor(data.score) };
}
