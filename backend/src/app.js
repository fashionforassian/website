const cors = require("cors");
const express = require("express");
const { env } = require("./config/env");
const { apiRouter } = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.frontendOrigins.includes(origin)) {
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
