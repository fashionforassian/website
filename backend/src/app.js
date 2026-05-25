const cors = require("cors");
const express = require("express");
const { apiRouter } = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");

const app = express();
const frontendOrigins = String(process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "backend", timestamp: new Date().toISOString() });
});

app.use(apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
