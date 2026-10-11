import { Router } from "express";
import upload from "../middleware/upload.js";
import { scoreResume } from "../controllers/scoring.js";

const router = Router();

// POST /api/score — multipart form: resume (PDF file) + jd (text)
router.post("/score", upload.single("resume"), scoreResume);

export default router;
