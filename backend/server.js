import express from "express";
import cors from "cors";
import multer from "multer";
import { extractText, getDocumentProxy } from "unpdf";
import { connectDB, saveScore } from "./db.js";
import { scoreSkills } from "./scorer.js";

// Fire-and-forget: the API should serve even if MongoDB is down.
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

// Health check: GET /
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "zero-to-shipped backend" });
});

// Main endpoint: multipart form with resume (PDF) + jd (text)
app.post("/api/score", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "resume PDF is required" });
  }
  const jd = req.body.jd || "";
  const pdfDoc = await getDocumentProxy(new Uint8Array(req.file.buffer));
  const { text: resumeText } = await extractText(pdfDoc, { mergePages: true });
  const result = scoreSkills(resumeText, jd);
  await saveScore({ fileName: req.file.originalname, ...result });
  res.json(result);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
