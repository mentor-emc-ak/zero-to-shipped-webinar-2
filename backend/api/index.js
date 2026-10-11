import { connectDB } from "../config/db.js";
import app from "../server.js";

// Local development entry point. On Vercel, api/index.js is the entry.
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
connectDB();
