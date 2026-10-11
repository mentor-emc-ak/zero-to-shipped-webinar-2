import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/zero-to-shipped";

// Each scored resume is saved so a mock history can be shown later.
const ScoreSchema = new mongoose.Schema(
  {
    fileName: String,
    score: Number,
    present: [String],
    missing: [String],
  },
  { versionKey: false }
);

const Score = mongoose.models.Score || mongoose.model("Score", ScoreSchema);

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (err) {
    // Scoring still works without a DB; persistence is best-effort.
    console.error("MongoDB connection failed:", err.message);
  }
}

export async function saveScore(doc) {
  try {
    await Score.create(doc);
  } catch {
    // No DB available — skip persistence, scoring is unaffected.
  }
}
