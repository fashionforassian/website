const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 4000),
  mongodbUri: process.env.MONGODB_URI || "",
  mongodbDbName: process.env.MONGODB_DB_NAME || "fashion_asia",
  clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
  adminUserIds: String(process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  frontendOrigins: String(process.env.FRONTEND_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

module.exports = { env };
