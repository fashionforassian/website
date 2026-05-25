const { app } = require("./app");
const { getDb } = require("./config/db");

async function startServer() {
  const port = Number(process.env.PORT || 4000);

  // ── MongoDB connection check ──────────────────────────────────────────────
  try {
    const db = await getDb();
    console.log(`✅ MongoDB connected  →  db: "${db.databaseName}"`);
  } catch (err) {
    console.error("❌ MongoDB connection FAILED:", err.message);
    console.error("   Check MONGODB_URI in your .env file.");
    process.exit(1); // Don't start the server if DB is unavailable
  }

  // ── HTTP server ───────────────────────────────────────────────────────────
  app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
  });
}

module.exports = { startServer };

