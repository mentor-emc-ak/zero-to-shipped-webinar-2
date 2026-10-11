import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import scoringRoutes from "./routes/scoring.js";
import { errorHandler } from "./middleware/errors.js";

// Fire-and-forget: the API should serve even if MongoDB is down.
connectDB();

const app = express();
app.use(cors());

// Health check: GET /
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "zero-to-shipped backend" });
});

// Scoring API: POST /api/score (multipart: resume PDF + jd text)
app.use("/api", scoringRoutes);

const PORT = process.env.PORT || 4000;
app.use(errorHandler);
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
