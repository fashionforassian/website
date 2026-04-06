const multer = require("multer");
const { badRequest } = require("../utils/http-error");
const { uploadImageBuffer } = require("../utils/image-upload");

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_REQUEST,
  },
});

function normalizeCropFocus(value) {
  const allowed = ["center", "north", "south", "east", "west"];
  return allowed.includes(value) ? value : "center";
}

async function uploadImages(req, res) {
  const files = Array.isArray(req.files) ? req.files : [];
  if (!files.length) {
    throw badRequest("No files received.");
  }

  const preset = req.body?.preset === "cover" ? "cover" : "gallery";
  const cropFocus = normalizeCropFocus(req.body?.cropFocus);

  const urls = [];

  for (const file of files) {
    if (!file.mimetype.startsWith("image/")) {
      throw badRequest("Only image uploads are allowed.");
    }

    const url = await uploadImageBuffer(file.buffer, preset, cropFocus);
    urls.push(url);
  }

  res.json({ urls });
}

module.exports = {
  uploadMiddleware,
  uploadImages,
};
