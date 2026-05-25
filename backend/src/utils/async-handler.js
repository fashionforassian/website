function asyncHandler(handler) {
  if (typeof handler !== "function") {
    throw new TypeError(`asyncHandler expected a function but received ${typeof handler}`);
  }

  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
