const { Router } = require("express");
const { requireAdminAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/async-handler");
const { uploadMiddleware, uploadImages } = require("../controllers/upload-controller");

const router = Router();

router.post(
  "/uploads",
  requireAdminAuth,
  uploadMiddleware.array("files", 10),
  asyncHandler(uploadImages),
);

module.exports = router;
