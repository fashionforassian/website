const { v2: cloudinary } = require("cloudinary");
const { env } = require("./env");

let isConfigured = false;

function configureCloudinary() {
  if (isConfigured) return;

  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new Error("Missing Cloudinary environment variables.");
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });

  isConfigured = true;
}

module.exports = {
  cloudinary,
  configureCloudinary,
};
