import { connectDB } from "../config/db.js";
import app from "../server.js";

// On Vercel this module is the serverless entry: Vercel invokes the exported
// app directly and provides the server, so we must not listen there.
export default app;

if (!process.env.VERCEL) {
  // Local development: run our own server on port 4000.
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
}

connectDB();
