class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

function badRequest(message) {
  return new HttpError(400, message);
}

function unauthorized(message = "Unauthorized") {
  return new HttpError(401, message);
}

function notFound(message = "Not found") {
  return new HttpError(404, message);
}

module.exports = {
  HttpError,
  badRequest,
  unauthorized,
  notFound,
};
