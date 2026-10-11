import { asyncHandler } from "../middleware/errors.js";
import scoringService from "../services/scoringService.js";
import { verdictFor } from "../utils.js";

// Thin layer: read the request, hand off to the service, shape the response.
export const scoreResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "resume PDF is required" });
  }
  const result = await scoringService.scoreResume(
    req.file.buffer,
    req.file.originalname,
    req.body.jd || ""
  );
  res.json({ ...result, verdict: verdictFor(result.score) });
});
