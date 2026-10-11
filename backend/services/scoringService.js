import { extractText, getDocumentProxy } from "unpdf";
import { scoreSkills } from "./scorer.js";
import { scoreWithAI } from "./aiScorer.js";
import { saveScore } from "../config/db.js";

// Extracts text from the PDF, scores it, persists best-effort.
// Primary path is labd AI; the keyword matcher is the fallback when the AI
// call fails (bad key, allowance spent, malformed reply, network error).
export async function scoreResume(pdfBuffer, fileName, jd) {
  const pdfDoc = await getDocumentProxy(new Uint8Array(pdfBuffer));
  const { text } = await extractText(pdfDoc, { mergePages: true });

  let result;
  try {
    result = await scoreWithAI(text, jd);
  } catch (err) {
    console.error("AI scoring failed, using keyword fallback:", err.message);
    result = { ...scoreSkills(text, jd), engine: "keyword" };
  }

  await saveScore({ fileName, ...result });
  return result;
}

export default { scoreResume };
