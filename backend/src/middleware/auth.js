const { verifyToken } = require("@clerk/backend");
const { getUserByClerkId } = require("../models/user-model");
const { unauthorized } = require("../utils/http-error");

function getAuthToken(req) {
  const header = req.headers.authorization || "";
  if (!header.toLowerCase().startsWith("bearer ")) return null;
  return header.slice(7).trim();
}

async function getVerifiedAuthPayload(req) {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY || "";

  if (!clerkSecretKey) {
    throw unauthorized("Missing CLERK_SECRET_KEY environment variable.");
  }

  const token = getAuthToken(req);
  if (!token) {
    throw unauthorized();
  }

  const payload = await verifyToken(token, { secretKey: clerkSecretKey });
  if (!payload?.sub) {
    throw unauthorized();
  }

  return payload;
}

async function requireUserAuth(req, _res, next) {
  try {
    const payload = await getVerifiedAuthPayload(req);
    req.userId = payload.sub;
    req.authPayload = payload;
    next();
  } catch (error) {
    next(error.statusCode ? error : unauthorized());
  }
}

async function requireAdminAuth(req, _res, next) {
  try {
    const payload = await getVerifiedAuthPayload(req);

    const user = await getUserByClerkId(payload.sub);
    if (!user || user.role !== "admin") {
      throw unauthorized("Admin access required.");
    }

    req.userId = payload.sub;
    req.authPayload = payload;
    next();
  } catch (error) {
    next(error.statusCode ? error : unauthorized());
  }
}

module.exports = {
  requireUserAuth,
  requireAdminAuth,
};
