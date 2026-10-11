// Thin client for the labd AI chat API. The key lives only on the server
// (DECISION.md) — the browser never sees it, it only ever talks to /api/score.
const API_URL = "https://agent.thedevlabs.io/v1/api/chat";

export async function askLabd(content) {
  if (!process.env.LABD_API_KEY) {
    throw new Error("LABD_API_KEY is not set");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LABD_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: [{ role: "user", content }] }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("labd API key is wrong or revoked");
    if (res.status === 402) throw new Error("labd allowance is used up");
    if (res.status === 403) throw new Error("labd API is switched off");
    if (res.status === 429) throw new Error("labd rate limit hit — wait and retry");
    throw new Error(`labd API error ${res.status}`);
  }

  const { message } = await res.json();
  return message.content;
}

export default { askLabd };
