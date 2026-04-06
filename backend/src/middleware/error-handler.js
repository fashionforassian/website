const { HttpError } = require("../utils/http-error");

function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Route not found." });
}

function errorHandler(error, _req, res, _next) {
  if (error?.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS blocked request origin." });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : "Unexpected backend error.",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
