import express from "express";
import cors from "cors";
import scoringRoutes from "./routes/scoring.js";
import { errorHandler } from "./middleware/errors.js";

const app = express();
app.use(cors());

// Health check: GET /
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "zero-to-shipped backend" });
});

// Scoring API: POST /api/score (multipart: resume PDF + jd text)
app.use("/api", scoringRoutes);

app.use(errorHandler);

export default app;
