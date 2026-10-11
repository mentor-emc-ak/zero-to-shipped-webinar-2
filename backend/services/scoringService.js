import { extractText, getDocumentProxy } from "unpdf";
import { scoreSkills } from "./scorer.js";
import { saveScore } from "../config/db.js";

// Extracts text from the PDF, scores it against the JD, persists best-effort.
export async function scoreResume(pdfBuffer, fileName, jd) {
  const pdfDoc = await getDocumentProxy(new Uint8Array(pdfBuffer));
  const { text } = await extractText(pdfDoc, { mergePages: true });
  const result = scoreSkills(text, jd);
  await saveScore({ fileName, ...result });
  return result;
}

export default { scoreResume };
